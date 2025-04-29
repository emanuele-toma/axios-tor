import * as fs from 'fs';

const FILES = ['package.json', 'README.md', 'LICENSE'];

for (const file of FILES) {
  const source = `./${file}`;
  const target = `./dist/${file}`;

  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
  }
}
