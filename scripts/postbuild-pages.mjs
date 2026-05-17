import { cpSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const docsDir = resolve('docs');
const sourceHtml = resolve(docsDir, 'index.html');
const fallbackHtml = resolve(docsDir, '404.html');
const pagePaths = ['our-story', 'collective', 'workshops', 'programs', 'inquiries'];

cpSync(sourceHtml, fallbackHtml);

for (const pagePath of pagePaths) {
  const targetFile = resolve(docsDir, pagePath, 'index.html');
  mkdirSync(dirname(targetFile), { recursive: true });
  cpSync(sourceHtml, targetFile);
}
