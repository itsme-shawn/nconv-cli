#!/usr/bin/env node

import { Command } from 'commander';
import { mdCommand } from './commands/md.js';
import { htmlCommand } from './commands/html.js';
import { pdfCommand } from './commands/pdf.js';
import { debugCommand } from './commands/debug.js';
import { handler as initHandler } from './commands/init.js';
import { startRepl } from './repl/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('nconv')
  .description('CLI tool for converting Notion pages to blog-ready markdown')
  .version(pkg.version);

program
  .command('init')
  .description('Create a default .env configuration file')
  .action(async () => {
    await initHandler({} as any); // Handler expects argv, but doesn't use it
  });

program
  .command('md <url>')
  .description('Convert a Notion page to markdown')
  .option('-o, --output <dir>', 'Output directory', './nconv-output')
  .option('-i, --image-dir <dir>', 'Image folder name (relative to output)', 'images')
  .option('-f, --filename <name>', '출력 파일명 (확장자 제외 또는 포함)')
  .option('-v, --verbose', 'Enable verbose logging', false)
  .action(async (url: string, options) => {
    await mdCommand(url, {
      output: options.output,
      imageDir: options.imageDir,
      filename: options.filename,
      verbose: options.verbose,
    });
  });

program
  .command('html <url>')
  .description('Convert a Notion page to HTML')
  .option('-o, --output <dir>', 'Output directory', './nconv-output')
  .option('-i, --image-dir <dir>', 'Image folder name (relative to output)', 'images')
  .option('-f, --filename <name>', 'Output filename (without extension or with)')
  .option('-v, --verbose', 'Enable verbose logging', false)
  .action(async (url: string, options) => {
    await htmlCommand(url, {
      output: options.output,
      imageDir: options.imageDir,
      filename: options.filename,
      verbose: options.verbose,
    });
  });

program
  .command('pdf <url>')
  .description('Convert a Notion page to PDF (renders actual Notion page)')
  .option('-o, --output <dir>', 'Output directory', './nconv-output')
  .option('-f, --filename <name>', 'Output filename (without extension or with)')
  .option('-v, --verbose', 'Enable verbose logging', false)
  .action(async (url: string, options) => {
    await pdfCommand(url, {
      output: options.output,
      imageDir: 'images', // Not used for PDF, but required by interface
      filename: options.filename,
      verbose: options.verbose,
    });
  });

// 개발 환경에서만 debug 명령어를 활성화
if (process.env.NODE_ENV !== 'production') {
  program
    .command('debug <url>')
    .description('Debug: Output raw markdown and image URLs')
    .option('-o, --output <dir>', '출력 디렉토리', './nconv-output')
    .option('-i, --image-dir <dir>', 'Image folder name', 'images')
    .option('-v, --verbose', 'Enable verbose logging', false)
    .action(async (url: string, options) => {
      await debugCommand(url, {
        output: options.output,
        imageDir: options.imageDir,
        filename: '',
        verbose: options.verbose,
      });
    });
}

// If no arguments provided, start REPL mode
(async () => {
  if (process.argv.length === 2) {
    await startRepl();
  } else {
    program.parse();
  }
})();
