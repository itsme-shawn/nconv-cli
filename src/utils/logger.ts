import chalk from 'chalk';
import ora, { Ora } from 'ora';

/**
 * print success log
 */
export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

/**
 * print error log
 */
export function error(message: string): void {
  console.error(chalk.red('✗'), message);
}

/**
 * print info log
 */
export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

/**
 * print warn log
 */
export function warn(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

/**
 * print spinner
 */
export function spinner(text: string): Ora {
  return ora(text).start();
}
