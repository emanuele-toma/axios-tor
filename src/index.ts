import axios from 'axios';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';

/**
 * AxiosTorOptions defines the configuration options for the AxiosTor instance.
 * These options are used to configure the connection to the Tor network and the Tor ControlPort.
 *
 * @property controlHost - The hostname of the Tor ControlPort. This is used to send commands to the Tor process.
 *                         Default is '127.0.0.1'.
 *                         To set this, ensure your Tor process is running and configured to accept control connections.
 *                         This can be set in the `torrc` file with the `ControlPort` directive.
 *
 * @property controlPort - The port number of the Tor ControlPort. Default is 9051.
 *                         This port is used to communicate with the Tor process for session management.
 *                         Ensure the `ControlPort` directive in the `torrc` file matches this value.
 *
 * @property controlPassword - The password for authenticating with the Tor ControlPort. Default is an empty string.
 *                             To generate a password, use the `tor --hash-password <your-password>` command.
 *                             Add the resulting hash to the `torrc` file with the `HashedControlPassword` directive.
 *
 * @property proxyHost - The hostname of the SOCKS5 proxy provided by Tor. Default is '127.0.0.1'.
 *                       This is used to route HTTP and HTTPS requests through the Tor network.
 *
 * @property proxyPort - The port number of the SOCKS5 proxy provided by Tor. Default is 9050.
 *                       Ensure the `SocksPort` directive in the `torrc` file matches this value.
 *
 * The `torrc` file is typically located in `/etc/tor/torrc` on Linux systems or `C:\Users\<username>\AppData\Roaming\Tor\torrc` on Windows.
 * This file is used to configure the Tor process, including enabling the ControlPort and setting up authentication.
 */
export interface AxiosTorOptions {
  /**
   * The hostname of the Tor ControlPort.
   * Default: '127.0.0.1'
   */
  controlHost: string;

  /**
   * The port number of the Tor ControlPort.
   * Default: 9051
   */
  controlPort: number;

  /**
   * The password for authenticating with the Tor ControlPort.
   * Default: '' (empty string)
   *
   * To generate a password, use the `tor --hash-password <your-password>` command.
   * Add the resulting hash to the `torrc` file with the `HashedControlPassword` directive.
   */
  controlPassword: string;

  /**
   * The hostname of the SOCKS5 proxy provided by Tor.
   * Default: '127.0.0.1'
   */
  proxyHost: string;

  /**
   * The port number of the SOCKS5 proxy provided by Tor.
   * Default: 9050
   *
   * Ensure the `SocksPort` directive in the `torrc` file matches this value.
   */
  proxyPort: number;
}

/**
 * AxiosTorInstance extends the AxiosInstance to include a method for renewing the Tor session.
 *
 * @method renewSession - Sends a NEWNYM signal to the Tor ControlPort to change the exit node and get a new IP address.
 *                        This is useful for maintaining anonymity or bypassing IP-based restrictions.
 *                        Ensure the ControlPort is enabled and properly configured in the `torrc` file.
 */
export interface AxiosTorInstance extends AxiosInstance {
  /**
   * Renews the Tor session by sending a NEWNYM signal to the Tor ControlPort.
   * This is useful for changing the exit node and getting a new IP address.
   * @returns A promise that resolves when the session has been renewed.
   */
  renewSession(): Promise<void>;
}

/**
 * AxiosTor is a wrapper around Axios that allows you to make HTTP and HTTPS requests through the Tor network.
 * It uses the SOCKS5 proxy provided by Tor to route requests and provides a method to renew the Tor session.
 *
 * @example
 * // Example usage:
 * import { AxiosTor } from 'axios-tor';
 *
 * const AxiosTor = AxiosTor.create({
 *   controlHost: '127.0.0.1',
 *   controlPort: 9051,
 *   controlPassword: 'your-control-password',
 *   proxyHost: '127.0.0.1',
 *   proxyPort: 9050,
 * });
 *
 * // Make a request through the Tor network
 * AxiosTor.get('http://check.torproject.org').then(response => {
 *   console.log(response.data);
 * });
 *
 * // Renew the Tor session
 * AxiosTor.renewSession().then(() => {
 *   console.log('Tor session renewed');
 * });
 *
 * @class AxiosTor
 */
export class AxiosTor {
  /**
   * Creates a new instance of AxiosTor with the provided configuration.
   * @param config - The configuration for the AxiosTor instance.
   * @returns A new instance of AxiosTor.
   */
  public static create(config?: CreateAxiosDefaults & Partial<AxiosTorOptions>): AxiosTorInstance {
    const _config = {
      controlHost: config?.controlHost ?? '127.0.0.1',
      controlPort: config?.controlPort ?? 9051,
      controlPassword: config?.controlPassword ?? '',
      proxyHost: config?.proxyHost ?? '127.0.0.1',
      proxyPort: config?.proxyPort ?? 9050,
    };

    const httpAgent = new SocksProxyAgent(`socks5h://${_config.proxyHost}:${_config.proxyPort}`);
    const httpsAgent = new SocksProxyAgent(`socks5h://${_config.proxyHost}:${_config.proxyPort}`);

    const axiosInstance = axios.create({
      ...config,
      httpAgent,
      httpsAgent,
    }) as AxiosTorInstance;

    axiosInstance.renewSession = () => AxiosTor.renewSession(_config);

    return axiosInstance;
  }

  private static async torIPC(config: AxiosTorOptions, commands: string[]): Promise<string> {
    // Only works in Node.js, not in browser
    if (typeof window !== 'undefined') {
      return Promise.reject(new Error('Tor control port communication is not supported in the browser.'));
    }

    const net = await import('net');

    return new Promise((resolve, reject) => {
      const socket = net.connect(
        {
          host: config.controlHost,
          port: config.controlPort,
        },
        () => {
          const commandString = commands.join('\n') + '\n';
          socket.write(commandString);
        }
      );

      socket.on('error', err => reject(err));

      let data = '';
      socket.on('data', chunk => {
        data += chunk.toString();
      });

      socket.on('end', () => resolve(data));
    });
  }

  private static async renewSession(config: AxiosTorOptions): Promise<void> {
    if (typeof window !== 'undefined') {
      return Promise.reject(new Error('Tor control port communication is not supported in the browser.'));
    }

    const commands = [`AUTHENTICATE \"${config.controlPassword}\"`, 'SIGNAL NEWNYM', 'QUIT'];

    const os = await import('os');

    const data = await this.torIPC(config, commands);
    const lines = data.split(os.EOL).slice(0, -1);
    const success = lines.every(val => val.length <= 0 || val.indexOf('250') >= 0);

    if (!success) {
      throw new Error('Error communicating with Tor ControlPort\n' + data);
    }
  }
}
