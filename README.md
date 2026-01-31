<p align="right">
  <a href="./README.ko.md">한국어</a>
</p>

# nconv-cli (Notion Convertor CLI)

> A CLI tool that converts Notion pages into blog-ready Markdown/HTML
> (with automatic image extraction and path normalization)

nconv-cli converts public Notion pages into Markdown or HTML
and extracts images into local files, organizing everything
in a blog-friendly directory structure.

## Features

- 🚀 Convert public Notion pages into Markdown or HTML
- 🖼️ Automatically download images and rewrite them as relative paths
- 📁 Output organized by post-level directory structure
- 💬 Provides both a slash-command–based interactive TUI (Claude Code–style) and a simple CLI interface
- 📄 Multiple output formats: Markdown (.md), HTML (.html)

## Problems with Existing Notion → Markdown Workflows

When moving content written in Notion to a blog,  
simple copy & paste or the built-in Markdown export often causes issues.

- **Copy & Paste**
  - Text is converted into Markdown-like syntax
  - Images remain linked to Notion CDN URLs
  - Image access frequently breaks with `Access Denied` errors

- **Notion Markdown Export**
  - Requires manual download and extraction of exported files
  - Difficult to organize content by individual posts

As a result, publishing to a blog usually involves  
manually downloading images, renaming files, fixing paths,  
and reorganizing directory structures.

| Method | Image Handling | Blog Usability |
|------|---------------|----------------|
| Copy & Paste | ❌ Dependent on Notion CDN | ❌ Broken images |
| Notion Export | ⚠️ Manual organization required | ⚠️ Inconvenient |
| **nconv-cli** | ✅ Local image extraction | ✅ Ready to publish |

## Recommended For

- Developers who write in Notion and publish Markdown posts to  
  Velog, Tistory, GitHub Pages, Hugo, or similar platforms
- Anyone who has experienced broken images due to Notion CDN issues
- Users looking to migrate Notion content into tools like Obsidian

## Environment

- **Node.js**: v20 or higher (npm v10 or higher)
- **TypeScript**: v5 or higher

## Installation

```bash
# Install the CLI globally
npm install -g nconv-cli
```

## TUI Interactive Mode

**nconv** provides an interactive TUI (Text User Interface) for easier configuration and usage.

### Starting TUI Interactive Mode

Simply run `nconv` without any arguments:

```bash
nconv
```

You'll see a prompt where you can enter slash commands:

```
╔════════════════════════════════════╗
║  NCONV CLI (Notion Converter CLI)  ║
╚════════════════════════════════════╝

ℹ Welcome to nconv interactive mode!
ℹ Type /help to see available commands
ℹ Type /exit to quit

nconv>
```

### Available Slash Commands

| Command | Description |
|---------|-------------|
| `/init` | Set up Notion tokens (interactive prompts) |
| `/config` | View and edit current configuration |
| `/md <url> [options]` | Convert Notion page to Markdown |
| `/html <url> [options]` | Convert Notion page to HTML |
| `/help` | Show help information |
| `/exit` | Exit interactive mode |

### TUI Interactive Mode Examples

```bash
# Start interactive mode
nconv

# Initialize configuration (you'll be prompted for tokens)
nconv> /init

# View current configuration
nconv> /config

# Convert a Notion page to Markdown
nconv> /md https://notion.so/My-Page-abc123

# Convert a Notion page to HTML
nconv> /html https://notion.so/My-Page-abc123

# Convert with options
nconv> /md https://notion.so/My-Page-abc123 -o ./blog -f my-post
nconv> /html https://notion.so/My-Page-abc123 -o ./blog -f my-post

# Exit
nconv> /exit
```

## CLI Mode

**nconv** also supports traditional CLI mode for scripting and automation.

### CLI Commands

```bash
# Initialize configuration
nconv init

# Convert a Notion page to Markdown
nconv md <notion-url>

# Convert a Notion page to HTML
nconv html <notion-url>

# Convert with custom options
nconv md <notion-url> [options]
nconv html <notion-url> [options]
```

### CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--output <dir>` | `-o` | Output directory | `./nconv-output` |
| `--image-dir <dir>` | `-i` | Image folder name (relative to output) | `images` |
| `--filename <name>` | `-f` | Output filename (with or without extension) | Extracted from URL |
| `--verbose` | `-v` | Enable verbose logging | `false` |

### CLI Examples

```bash
# Convert to Markdown (basic)
nconv md "https://notion.so/My-Page-abc123"

# Convert to HTML
nconv html "https://notion.so/My-Page-abc123"

# Custom output directory
nconv md "https://notion.so/My-Page-abc123" -o ./blog-posts
nconv html "https://notion.so/My-Page-abc123" -o ./blog-posts

# Custom filename
nconv md "https://notion.so/My-Page-abc123" -f "my-article"
nconv html "https://notion.so/My-Page-abc123" -f "my-article"

# All options combined
nconv md "https://notion.so/My-Page-abc123" -o ./blog -i assets -f "article-1" -v
nconv html "https://notion.so/My-Page-abc123" -o ./blog -i assets -f "article-1" -v
```

## Configuration

You can configure Notion tokens in two ways:

### 1. Interactive Configuration (Recommended)

Use the interactive mode's `/init` command for a guided setup:

```bash
nconv
nconv> /init
```

This will prompt you to enter `TOKEN_V2` and `FILE_TOKEN` with validation.

### 2. Manual Configuration

Run the following command to create the configuration file:

```bash
nconv init
```

This creates a `.env` file at `~/.nconv/.env`. Open this file and add your token values.

### How to Find Notion Tokens

1. Log in to [notion.so](https://notion.so) in your browser.
2. Open the browser's developer tools (usually F12).
3. Go to the "Application" tab.
4. Find the "Cookies" section and select `https://www.notion.so`.
5. Copy the value of the `token_v2` cookie and paste it into the `TOKEN_V2` field.
6. Copy the value of the `file_token` cookie and paste it into the `FILE_TOKEN` field.

## Usage

### Basic Usage

```bash
# Convert to Markdown
nconv md <notion-url>

# Convert to HTML
nconv html <notion-url>
```

### Examples

```bash
# Convert to Markdown (saved to ./nconv-output)
nconv md "https://notion.so/My-Page-abc123"

# Convert to HTML
nconv html "https://notion.so/My-Page-abc123"

# Specify output directory
nconv md "https://notion.so/My-Page-abc123" -o ./blog-posts
nconv html "https://notion.so/My-Page-abc123" -o ./blog-posts

# Custom filename
nconv md "https://notion.so/My-Page-abc123" -f "my-article"
nconv html "https://notion.so/My-Page-abc123" -f "my-article"

# Verbose logging
nconv md "https://notion.so/My-Page-abc123" -v

# All options
nconv md "https://notion.so/My-Page-abc123" -o ./blog -i assets -f "article-1" -v
nconv html "https://notion.so/My-Page-abc123" -o ./blog -i assets -f "article-1" -v
```

## Options

| Option              | Short | Description                                 | Default            |
| ------------------- | ----- | ------------------------------------------- | ------------------ |
| `--output <dir>`    | `-o`  | Output directory                            | `./output`         |
| `--image-dir <dir>` | `-i`  | Image directory (relative to output)        | `images`           |
| `--filename <name>` | `-f`  | Output filename (with or without extension) | Extracted from URL |
| `--verbose`         | `-v`  | Enable verbose logging                      | `false`            |

## Output Structure

**Markdown output:**

```text
nconv-output/
├── my-article-folder/
│   ├── my-article.md
│   └── images/
│       ├── abc12345.png
│       ├── def67890.jpg
│       └── ...
```

**HTML output:**

```text
nconv-output/
├── my-article-folder/
│   ├── my-article.html
│   └── images/
│       ├── abc12345.png
│       ├── def67890.jpg
│       └── ...
```

Image paths are converted to relative paths:

**Markdown:**
```md
![image](./images/abc12345.png)
```

**HTML:**
```html
<img src="./images/abc12345.png" />
```

## Libraries

### Main Libraries

* **notion-exporter**: Export Notion pages to Markdown
* **commander**: CLI command definition and parsing
* **@inquirer/prompts**: Interactive command-line prompts for TUI
* **axios**: HTTP client (image downloads)
* **dotenv**: Environment variable management
* **chalk**: Terminal output styling
* **ora**: Terminal spinner for progress display
* **slugify**: Convert strings to URL-friendly slugs
* **uuid**: Generate unique IDs

### Open Source Licenses

* **nconv-cli**: [ISC License](LICENSE)
* This project uses multiple open source libraries,
  each distributed under its respective license.

## Development

```bash
# Install dependencies
npm install

# Development mode (watch files)
npm run dev

# Build
npm run build

# Local testing
npm link
nconv md "https://notion.so/test-page"
```

## Project Structure

```text
nconv/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── config.ts             # Configuration management
│   ├── commands/
│   │   ├── init.ts           # init command
│   │   ├── md.ts             # md command
│   │   ├── html.ts           # html command
│   │   └── debug.ts          # debug command
│   ├── repl/
│   │   ├── index.ts          # Interactive REPL mode
│   │   ├── commands.ts       # Slash command handlers
│   │   └── prompts.ts        # Interactive prompts
│   ├── core/
│   │   ├── exporter.ts       # Notion export logic
│   │   └── image-processor.ts # Image processing
│   └── utils/
│       ├── file.ts           # File utilities
│       └── logger.ts         # Logging
├── bin/
│   └── nconv.js              # Executable
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## For Developers

If you want to contribute to `nconv-cli`, follow these steps to set up a local development environment.

```bash
# Clone the repository
git clone https://github.com/your-username/nconv-cli.git
cd nconv-cli

# Install dependencies
npm install

# Link the CLI for local testing
npm link
```

The development environment still uses the global configuration file at `~/.nconv/.env`. Ensure you have run `nconv init` and configured your tokens before running local tests.

You can run the CLI in development mode with auto-reloading:

```bash
# Development mode (watch files)
npm run dev

# Now you can use the 'nconv' command in a separate terminal
nconv md "https://notion.so/test-page"
```
