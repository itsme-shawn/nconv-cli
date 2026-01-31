import prompts from 'prompts';
import chalk from 'chalk';
import * as logger from '../utils/logger.js';
import { executeCommand, getCommandChoices } from './commands.js';

/**
 * Display a centered banner with dynamic box sizing
 */
function showBanner(): void {
  const title = 'NCONV CLI (Notion Converter CLI)';
  const padding = 2;
  const totalWidth = title.length + (padding * 2);

  const topBorder = '╔' + '═'.repeat(totalWidth) + '╗';
  const bottomBorder = '╚' + '═'.repeat(totalWidth) + '╝';

  console.log(chalk.cyan('\n' + topBorder));
  console.log(chalk.cyan('║') + chalk.bold(' '.repeat(padding) + title + ' '.repeat(padding)) + chalk.cyan('║'));
  console.log(chalk.cyan(bottomBorder + '\n'));

  logger.info('Welcome to nconv interactive mode!');
  logger.info('Type /help to see available commands');
  logger.info('Type /exit to quit\n');

  // Show quick examples
  console.log(chalk.dim('Quick examples:'));
  console.log(chalk.dim('  /init                           - Set up Notion tokens'));
  console.log(chalk.dim('  /md <url>                       - Convert Notion page'));
  console.log(chalk.dim('  /md <url> -o ./blog -f my-post  - Convert with options\n'));
}

/**
 * Start the REPL loop
 */
export async function startRepl(): Promise<void> {
  showBanner();

  let shouldExit = false;

  while (!shouldExit) {
    try {
      const response = await prompts({
        type: 'autocomplete',
        name: 'command',
        message: chalk.cyan('nconv'),
        choices: getCommandChoices(),
        suggest: async (input: string, choices: any[]) => {
          // If input doesn't start with /, add it for search
          const searchInput = input.startsWith('/') ? input : `/${input}`;

          // Filter choices based on input
          const filtered = choices.filter((choice: any) =>
            choice.title.toLowerCase().startsWith(searchInput.toLowerCase())
          );

          // If user typed a full command or URL, allow it
          if (filtered.length === 0 && input.trim()) {
            return Promise.resolve([{ title: input, value: input }]);
          }

          return Promise.resolve(filtered);
        },
        limit: 5,
      });

      if (response.command === undefined) {
        // User cancelled (Ctrl+C)
        console.log('\n');
        logger.info('Goodbye! 👋');
        break;
      }

      shouldExit = await executeCommand(response.command);

      if (!shouldExit) {
        console.log(); // Empty line for readability
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error: ${error.message}`);
        console.log(); // Empty line for readability
      }
    }
  }

  logger.info('Exiting nconv...');
}
