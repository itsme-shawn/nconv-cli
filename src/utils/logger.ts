import chalk from 'chalk';
import ora, { Ora } from 'ora';

/**
 * 성공 메시지 출력
 */
export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

/**
 * 에러 메시지 출력
 */
export function error(message: string): void {
  console.error(chalk.red('✗'), message);
}

/**
 * 정보 메시지 출력
 */
export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

/**
 * 경고 메시지 출력
 */
export function warn(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

/**
 * 스피너 생성
 */
export function spinner(text: string): Ora {
  return ora(text).start();
}
