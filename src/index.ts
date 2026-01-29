#!/usr/bin/env node

import { Command } from 'commander';
import { mdCommand } from './commands/md.js';
import { debugCommand } from './commands/debug.js';

const program = new Command();

program
  .name('nconv')
  .description('CLI tool for converting Notion pages to blog-ready markdown')
  .version('1.0.0');

program
  .command('md <url>')
  .description('Convert a Notion page to markdown')
  .option('-o, --output <dir>', 'Output directory', './output')
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

// 개발 환경에서만 debug 명령어를 활성화
if (process.env.NODE_ENV !== 'production') {
  program
    .command('debug <url>')
    .description('Debug: Output raw markdown and image URLs')
    .option('-o, --output <dir>', '출력 디렉토리', './output')
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

program.parse();
