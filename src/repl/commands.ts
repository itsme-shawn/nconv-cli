import { input, confirm } from '@inquirer/prompts';
import * as logger from '../utils/logger.js';
import { mdCommand } from '../commands/md.js';
import { htmlCommand } from '../commands/html.js';
import { validateConfig } from '../config.js';
import {
  loadConfig,
  saveConfig,
  promptInitConfig,
  promptEditConfig,
} from './prompts.js';

/**
 * Handle /init command - Initialize configuration
 */
export async function handleInit(): Promise<void> {
  const existing = loadConfig();
  const isFirstTime = !existing || (!existing.TOKEN_V2 && !existing.FILE_TOKEN);

  // If config already exists, ask for confirmation
  if (!isFirstTime) {
    logger.warn('Configuration already exists.');

    try {
      const overwrite = await confirm({
        message: 'Do you want to overwrite the existing configuration?',
        default: false,
      });

      if (!overwrite) {
        logger.info('Configuration unchanged. Use /config to view or edit your settings.');
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'User force closed the prompt') {
        logger.warn('\nCancelled.');
      }
      return;
    }
  }

  // Show detailed instructions for token setup
  logger.info('\n📝 How to find your Notion tokens\n');
  logger.info('1. Log in to https://notion.so in your browser');
  logger.info('2. Open browser developer tools (press F12)');
  logger.info('3. Go to the "Application" tab');
  logger.info('4. Find "Cookies" section and select https://www.notion.so');
  logger.info('5. Copy the value of "token_v2" cookie → TOKEN_V2');
  logger.info('6. Copy the value of "file_token" cookie → FILE_TOKEN\n');

  try {
    const config = await promptInitConfig();
    saveConfig(config);
  } catch (error) {
    if (error instanceof Error && error.message === 'User force closed the prompt') {
      logger.warn('\nConfiguration cancelled.');
    } else {
      throw error;
    }
  }
}

/**
 * Handle /config command - View and edit configuration
 */
export async function handleConfig(): Promise<void> {
  const existing = loadConfig();

  if (!existing || (!existing.TOKEN_V2 && !existing.FILE_TOKEN)) {
    logger.warn('No configuration found.');
    logger.info('Run /init to create initial configuration.');
    return;
  }

  logger.info('Current configuration:');
  logger.info(`TOKEN_V2: ${existing.TOKEN_V2 ? '***' + existing.TOKEN_V2.slice(-8) : '(not set)'}`);
  logger.info(`FILE_TOKEN: ${existing.FILE_TOKEN ? '***' + existing.FILE_TOKEN.slice(-8) : '(not set)'}\n`);

  try {
    const edit = await input({
      message: 'Edit configuration? (y/n)',
      default: 'n',
    });

    if (edit.toLowerCase() === 'y' || edit.toLowerCase() === 'yes') {
      const newConfig = await promptEditConfig(existing);
      saveConfig(newConfig);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'User force closed the prompt') {
      logger.warn('\nEdit cancelled.');
    } else {
      throw error;
    }
  }
}

/**
 * Handle /md command - Convert Notion page to markdown
 */
export async function handleMd(args: string[]): Promise<void> {
  let url = '';
  const options: any = {
    output: './nconv-output',
    imageDir: 'images',
    verbose: false,
  };

  // Interactive mode (TUI) - step by step prompts
  if (args.length === 0) {
    try {
      // Step 1: URL
      url = await input({
        message: 'Notion URL',
        validate: (value) => {
          if (!value.trim()) return 'URL is required';
          if (!value.includes('notion.so') && !value.includes('notion.site')) {
            return 'Please enter a valid Notion URL';
          }
          return true;
        },
      });

      // Step 2: Output directory
      const outputDir = await input({
        message: 'Output directory [default: ./nconv-output]',
        default: './nconv-output',
      });
      options.output = outputDir;

      // Step 3: Filename (optional, auto-generated if empty)
      const filename = await input({
        message: 'Filename [leave empty for auto-generated]',
        default: '',
      });
      if (filename.trim()) {
        options.filename = filename;
      }

      // Step 4: Verbose logging
      options.verbose = await confirm({
        message: 'Enable verbose logging?',
        default: false,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User force closed the prompt') {
        logger.warn('\nConversion cancelled.');
      }
      return;
    }
  } else {
    // CLI mode - parse arguments
    url = args[0];
    const additionalArgs = args.slice(1);

    // Parse options
    for (let i = 0; i < additionalArgs.length; i++) {
      const arg = additionalArgs[i];
      if ((arg === '-o' || arg === '--output') && i + 1 < additionalArgs.length) {
        options.output = additionalArgs[++i];
      } else if ((arg === '-i' || arg === '--image-dir') && i + 1 < additionalArgs.length) {
        options.imageDir = additionalArgs[++i];
      } else if ((arg === '-f' || arg === '--filename') && i + 1 < additionalArgs.length) {
        options.filename = additionalArgs[++i];
      } else if (arg === '-v' || arg === '--verbose') {
        options.verbose = true;
      }
    }
  }

  // Check if config is valid
  const configCheck = validateConfig();
  if (!configCheck.valid) {
    logger.error('Cannot convert Notion page:');
    logger.error(configCheck.message || 'Configuration is invalid.');
    return;
  }

  await mdCommand(url, options);
}

/**
 * Handle /html command - Convert Notion page to HTML
 */
export async function handleHtml(args: string[]): Promise<void> {
  let url = '';
  const options: any = {
    output: './nconv-output',
    imageDir: 'images',
    verbose: false,
  };

  // Interactive mode (TUI) - step by step prompts
  if (args.length === 0) {
    try {
      // Step 1: URL
      url = await input({
        message: 'Notion URL',
        validate: (value) => {
          if (!value.trim()) return 'URL is required';
          if (!value.includes('notion.so') && !value.includes('notion.site')) {
            return 'Please enter a valid Notion URL';
          }
          return true;
        },
      });

      // Step 2: Output directory
      const outputDir = await input({
        message: 'Output directory [default: ./nconv-output]',
        default: './nconv-output',
      });
      options.output = outputDir;

      // Step 3: Filename (optional, auto-generated if empty)
      const filename = await input({
        message: 'Filename [leave empty for auto-generated]',
        default: '',
      });
      if (filename.trim()) {
        options.filename = filename;
      }

      // Step 4: Verbose logging
      options.verbose = await confirm({
        message: 'Enable verbose logging?',
        default: false,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'User force closed the prompt') {
        logger.warn('\nConversion cancelled.');
      }
      return;
    }
  } else {
    // CLI mode - parse arguments
    url = args[0];
    const additionalArgs = args.slice(1);

    // Parse options
    for (let i = 0; i < additionalArgs.length; i++) {
      const arg = additionalArgs[i];
      if ((arg === '-o' || arg === '--output') && i + 1 < additionalArgs.length) {
        options.output = additionalArgs[++i];
      } else if ((arg === '-i' || arg === '--image-dir') && i + 1 < additionalArgs.length) {
        options.imageDir = additionalArgs[++i];
      } else if ((arg === '-f' || arg === '--filename') && i + 1 < additionalArgs.length) {
        options.filename = additionalArgs[++i];
      } else if (arg === '-v' || arg === '--verbose') {
        options.verbose = true;
      }
    }
  }

  // Check if config is valid
  const configCheck = validateConfig();
  if (!configCheck.valid) {
    logger.error('Cannot convert Notion page:');
    logger.error(configCheck.message || 'Configuration is invalid.');
    return;
  }

  await htmlCommand(url, options);
}

/**
 * Available commands list
 */
const AVAILABLE_COMMANDS = [
  {
    name: 'init',
    description: 'Initialize configuration (set Notion tokens)',
    examples: ['/init'],
  },
  {
    name: 'config',
    description: 'View and edit current configuration',
    examples: ['/config'],
  },
  {
    name: 'md',
    description: 'Convert Notion page to markdown',
    examples: [
      '/md https://notion.so/page-id',
      '/md https://notion.so/page-id -o ./blog',
      '/md https://notion.so/page-id -o ./blog -f my-post -v',
    ],
  },
  {
    name: 'html',
    description: 'Convert Notion page to HTML',
    examples: [
      '/html https://notion.so/page-id',
      '/html https://notion.so/page-id -o ./blog',
      '/html https://notion.so/page-id -o ./blog -f my-post -v',
    ],
  },
  {
    name: 'help',
    description: 'Show this help message',
    examples: ['/help'],
  },
  {
    name: 'exit',
    description: 'Exit the REPL',
    examples: ['/exit'],
  },
];

/**
 * Get command suggestions based on input
 */
export function getCommandSuggestions(input: string): string[] {
  const cleanInput = input.toLowerCase().replace(/^\//, '');
  return AVAILABLE_COMMANDS
    .filter((cmd) => cmd.name.startsWith(cleanInput))
    .map((cmd) => `/${cmd.name}`);
}

/**
 * Get command choices for autocomplete
 */
export function getCommandChoices() {
  return AVAILABLE_COMMANDS.map((cmd) => ({
    title: `/${cmd.name}`,
    value: `/${cmd.name}`,
    description: cmd.description,
  }));
}

/**
 * Find similar commands using simple string distance
 */
function findSimilarCommand(input: string): string | null {
  const cleanInput = input.toLowerCase();
  for (const cmd of AVAILABLE_COMMANDS) {
    if (cmd.name.includes(cleanInput) || cleanInput.includes(cmd.name)) {
      return cmd.name;
    }
  }
  return null;
}

/**
 * Handle /help command - Show help information
 */
export function handleHelp(): void {
  logger.info('Available commands:\n');

  AVAILABLE_COMMANDS.forEach((cmd) => {
    logger.info(`  /${cmd.name.padEnd(20)} ${cmd.description}`);
  });

  console.log('');
  logger.info('Conversion options (for /md and /html):');
  logger.info('  -o, --output <dir>      Output directory (default: ./nconv-output)');
  logger.info('  -i, --image-dir <dir>   Image folder name (default: images)');
  logger.info('  -f, --filename <name>   Output filename');
  logger.info('  -v, --verbose           Enable verbose logging\n');

  logger.info('Examples:');
  AVAILABLE_COMMANDS.forEach((cmd) => {
    cmd.examples.forEach((example) => {
      logger.info(`  ${example}`);
    });
  });
  console.log('');
}

/**
 * Parse and execute a slash command
 */
export async function executeCommand(input: string): Promise<boolean> {
  const trimmed = input.trim();

  if (!trimmed) {
    return false;
  }

  if (!trimmed.startsWith('/')) {
    logger.error('Commands must start with /');
    logger.info('Type /help for available commands');
    logger.info('Example: /init, /md <url>, /config\n');
    return false;
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'init':
      await handleInit();
      break;

    case 'config':
      await handleConfig();
      break;

    case 'md':
      await handleMd(args);
      break;

    case 'html':
      await handleHtml(args);
      break;

    case 'help':
    case 'h':
      handleHelp();
      break;

    case 'exit':
    case 'quit':
    case 'q':
      return true;

    default:
      logger.error(`Unknown command: /${command}`);

      // Try to suggest a similar command
      const similar = findSimilarCommand(command);
      if (similar) {
        logger.info(`Did you mean /${similar}?`);
      }

      logger.info('Type /help to see all available commands\n');

      // Show available commands
      const suggestions = getCommandSuggestions(command);
      if (suggestions.length > 0 && suggestions.length < 5) {
        logger.info('Available commands:');
        suggestions.forEach((cmd) => logger.info(`  ${cmd}`));
        console.log('');
      }
  }

  return false;
}
