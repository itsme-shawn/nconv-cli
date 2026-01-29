#!/usr/bin/env node

import { Command } from 'commander';
import { mdCommand } from './commands/md.js';
import { debugCommand } from './commands/debug.js';

const program = new Command();

program
  .name('notion-convertor')
  .description('Notion 페이지를 블로그용 마크다운으로 변환하는 CLI 도구')
  .version('1.0.0');

program
  .command('md <url>')
  .description('Notion 페이지를 마크다운으로 변환')
  .option('-o, --output <dir>', '출력 디렉토리', './output')
  .option('-i, --image-dir <dir>', '이미지 폴더명 (output 기준 상대경로)', 'images')
  .option('-f, --filename <name>', '출력 파일명 (확장자 제외 또는 포함)')
  .option('-v, --verbose', '상세 로그 출력', false)
  .action(async (url: string, options) => {
    await mdCommand(url, {
      output: options.output,
      imageDir: options.imageDir,
      filename: options.filename,
      verbose: options.verbose,
    });
  });

program
  .command('debug <url>')
  .description('디버깅: 원본 마크다운 및 이미지 URL 출력')
  .option('-o, --output <dir>', '출력 디렉토리', './output')
  .option('-i, --image-dir <dir>', '이미지 폴더명', 'images')
  .option('-v, --verbose', '상세 로그 출력', false)
  .action(async (url: string, options) => {
    await debugCommand(url, {
      output: options.output,
      imageDir: options.imageDir,
      filename: '',
      verbose: options.verbose,
    });
  });

program.parse();
