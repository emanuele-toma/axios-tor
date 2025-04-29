<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GNU AGPLv3][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Axios TOR</h3>

  <p align="center">
    A simple and easy to use Axios wrapper for Tor.
    <br />
    <br />
    <a href="https://github.com/emanuele-toma/axios-tor/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/emanuele-toma/axios-tor/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Axios-tor is a simple and easy to use Axios wrapper for Tor. It allows you to make HTTP requests through the Tor network using the Axios library.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Axios][Axios]][Axios-url]
- [![Node][Node.js]][Node-url]
- [![Tor][TorProject]][Tor-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

To install this project, you need to have the following software installed on your machine:

- npm or any other package manager
- Node.js
- Tor client running on your machine

### Installation

```sh
# Use your preferred package manager, npm, yarn, pnpm, bun, etc.
npm install axios-tor
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Basic Usage

The `axios-tor` library allows you to make HTTP and HTTPS requests through the Tor network using Axios. Below are examples of how to use it.

#### Example: Basic GET Request

```typescript
import { AxiosTor } from 'axios-tor';

const axiosTor = AxiosTor.create({
  controlHost: '127.0.0.1',
  controlPort: 9051,
  controlPassword: 'your-control-password',
  proxyHost: '127.0.0.1',
  proxyPort: 9050,
});

axiosTor.get('http://check.torproject.org').then(response => {
  console.log(response.data); // Check if the request is routed through Tor
});
```

#### Example: Renewing the Tor Session

You can renew the Tor session to change the exit node and get a new IP address:

```typescript
axiosTor.renewSession().then(() => {
  console.log('Tor session renewed');
});
```

#### Example: Custom Axios Configuration

You can pass additional Axios configuration options when creating the `axios-tor` instance:

```typescript
const axiosTor = AxiosTor.create({
  baseURL: 'https://example.com',
  timeout: 5000,
  headers: {
    'User-Agent': 'axios-tor',
  },
  proxyHost: '127.0.0.1',
  proxyPort: 9050,
});
```

### Installing and Configuring Tor

To use `axios-tor`, you need a running Tor client. Below are the steps to install and configure it.

#### Installing Tor

1. **Linux**:

   ```bash
   sudo apt update
   sudo apt install tor
   ```

2. **macOS** (via Homebrew):

   ```bash
   brew install tor
   ```

3. **Windows**:
   Download and install the Tor Expert Bundle from the [official Tor Project website](https://www.torproject.org/).

#### Configuring Tor

To enable the ControlPort and SOCKS5 proxy, edit the `torrc` configuration file:

1. Locate the `torrc` file:

   - **Linux**: `/etc/tor/torrc`
   - **macOS**: `/usr/local/etc/tor/torrc`
   - **Windows**: `C:\Users\<username>\AppData\Roaming\Tor\torrc`

2. Add or update the following lines:

   ```
   ControlPort 9051
   HashedControlPassword <hashed-password>
   SocksPort 9050
   ```

3. Generate a hashed password for the `ControlPort`:

   ```bash
   tor --hash-password <your-password>
   ```

   Replace `<your-password>` with your desired password. Copy the resulting hash and replace `<hashed-password>` in the `torrc` file.

4. Restart the Tor service:
   ```bash
   sudo systemctl restart tor
   ```

### Using a Docker Container for Tor

For a simpler setup, you can use a pre-configured Docker container with Tor. We recommend using the [osminogin/tor-simple](https://hub.docker.com/r/osminogin/tor-simple) image.

#### Running the Docker Container

1. Pull the Docker image:

   ```bash
   docker pull osminogin/tor-simple
   ```

2. Run the container:
   ```bash
   docker run -d --name tor -p 9050:9050 osminogin/tor-simple
   ```

This will expose the SOCKS5 proxy on port `9050` and the ControlPort on port `9051`.

#### Connecting to the Dockerized Tor

When using the Docker container, configure `axios-tor` as follows:

```typescript
const axiosTor = AxiosTor.create({
  proxyHost: '127.0.0.1',
  proxyPort: 9050,
});
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/emanuele-toma/axios-tor/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=emanuele-toma/axios-tor" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->

## License

Distributed under the GNU AGPLv3. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/emanuele-toma/axios-tor](https://github.com/emanuele-toma/axios-tor)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/emanuele-toma/axios-tor.svg?style=for-the-badge
[contributors-url]: https://github.com/emanuele-toma/axios-tor/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/emanuele-toma/axios-tor.svg?style=for-the-badge
[forks-url]: https://github.com/emanuele-toma/axios-tor/network/members
[stars-shield]: https://img.shields.io/github/stars/emanuele-toma/axios-tor.svg?style=for-the-badge
[stars-url]: https://github.com/emanuele-toma/axios-tor/stargazers
[issues-shield]: https://img.shields.io/github/issues/emanuele-toma/axios-tor.svg?style=for-the-badge
[issues-url]: https://github.com/emanuele-toma/axios-tor/issues
[license-shield]: https://img.shields.io/github/license/emanuele-toma/axios-tor.svg?style=for-the-badge
[license-url]: https://github.com/emanuele-toma/axios-tor/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[Axios]: https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white
[Axios-url]: https://axios-http.com/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[TorProject]: https://img.shields.io/badge/Tor-7D4698?style=for-the-badge&logo=torproject&logoColor=white
[Tor-url]: https://www.torproject.org/
