#!/usr/bin/env node

import fs from 'fs';
import { encode } from './encoder.js';
import { publish } from './publisher.js';

// --- Stdin Helper ---
function getStdin() {
  return new Promise((resolve) => {
    let data = '';
    const timeout = setTimeout(() => resolve(''), 100);
    process.stdin.on('readable', () => {
      clearTimeout(timeout);
      let chunk;
      while (null !== (chunk = process.stdin.read())) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => {
      clearTimeout(timeout);
      resolve(data.trim());
    });
  });
}

// --- Help Messages ---
function printEncodeHelp() {
    console.log(`
Usage: aah-cli encode [options]

Encodes a file or text into an itty.bitty-compatible URL fragment.

Options:
  -f, --file <path>      Path to the source file to encode.
  -t, --text <string>    A direct string of text to encode.
  -a, --algorithm <type> The compression algorithm to use (gzip or lzma). Default: gzip.
  -h, --help             Display this help message.

Input must be provided from a file, the --text option, or stdin.
    `);
}

function printPublishHelp() {
    console.log(`
Usage: aah-cli publish [options]

Encodes content and publishes the link to a file in a GitHub repository.

Content Options:
  -f, --file <path>      Path to the source file to encode.
  -t, --text <string>    A direct string of text to encode.

Publishing Options:
  --repo <url>           Required. The URL of the target GitHub repository.
  --path <filepath>      Required. The path to the file to update in the repo.
  --branch <name>        The target branch name. Defaults to 'main'.
  --message <msg>        The commit message. Defaults to a standard message.
  -a, --algorithm <type> The compression algorithm. Defaults to 'gzip'.
  -h, --help             Display this help message.
    `);
}

function printHelp() {
    console.log(`
Usage: aah-cli <command> [options]

Commands:
  encode    Encodes a file or text.
  publish   Encodes content and publishes it to a GitHub repository.

Run 'aah-cli <command> --help' for more information on a specific command.
    `);
}

// --- Argument Parsers ---
function parseEncodeArgs(args) {
    let options = { algorithm: 'gzip' };
    for (let i = 0; i < args.length; i++) {
        if ((args[i] === '-f' || args[i] === '--file') && i + 1 < args.length) options.inputFile = args[++i];
        else if ((args[i] === '-t' || args[i] === '--text') && i + 1 < args.length) options.inputText = args[++i];
        else if ((args[i] === '-a' || args[i] === '--algorithm') && i + 1 < args.length) options.algorithm = args[++i];
    }
    return options;
}

function parsePublishArgs(args) {
    let options = { algorithm: 'gzip', branch: 'main' };
    for (let i = 0; i < args.length; i++) {
        if ((args[i] === '-f' || args[i] === '--file') && i + 1 < args.length) options.inputFile = args[++i];
        else if ((args[i] === '-t' || args[i] === '--text') && i + 1 < args.length) options.inputText = args[++i];
        else if (args[i] === '--repo' && i + 1 < args.length) options.repoUrl = args[++i];
        else if (args[i] === '--path' && i + 1 < args.length) options.filePath = args[++i];
        else if (args[i] === '--branch' && i + 1 < args.length) options.branch = args[++i];
        else if (args[i] === '--message' && i + 1 < args.length) options.commitMessage = args[++i];
        else if ((args[i] === '-a' || args[i] === '--algorithm') && i + 1 < args.length) options.algorithm = args[++i];
    }
    return options;
}


// --- Command Handlers ---
async function handleEncodeCommand(args) {
    if (args.includes('--help') || args.includes('-h')) {
        printEncodeHelp();
        return;
    }
    const { inputFile, inputText, algorithm } = parseEncodeArgs(args);

    let content;
    if (inputFile && inputText) {
        console.error("Error: Please provide input from only one source: --file or --text.");
        return;
    }
    if (inputFile) content = fs.readFileSync(inputFile, 'utf8');
    else if (inputText) content = inputText;
    else content = await getStdin();

    if (!content) {
        console.error("Error: No input provided or input was empty.");
        printEncodeHelp();
        return;
    }

    const encodedString = await encode(content, algorithm);
    process.stdout.write(encodedString);
}

async function handlePublishCommand(args) {
    if (args.includes('--help') || args.includes('-h')) {
        printPublishHelp();
        return;
    }
    const options = parsePublishArgs(args);
    const { inputFile, inputText, repoUrl, filePath, algorithm } = options;

    if (!repoUrl || !filePath) {
        console.error("Error: --repo and --path are required arguments.");
        printPublishHelp();
        return;
    }

    let content;
    if (inputFile && inputText) {
        console.error("Error: Please provide content from only one source: --file or --text.");
        return;
    }
    if (inputFile) content = fs.readFileSync(inputFile, 'utf8');
    else if (inputText) content = inputText;
    else content = await getStdin();

    if (!content) {
        console.error("Error: No input provided to publish.");
        printPublishHelp();
        return;
    }

    console.log("Encoding content...");
    const encodedString = await encode(content, algorithm);

    // For now, we'll just append the raw string. A more advanced version could format it.
    const contentToAppend = `https://itty.bitty.host/#/${encodedString}`;

    await publish({ ...options, contentToAppend });
}

// --- Main Dispatcher ---
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const commandArgs = args.slice(1);

    try {
        switch (command) {
            case 'encode':
                await handleEncodeCommand(commandArgs);
                break;
            case 'publish':
                await handlePublishCommand(commandArgs);
                break;
            default:
                printHelp();
                break;
        }
    } catch (error) {
        console.error(`An unexpected error occurred: ${error.message}`);
        process.exit(1);
    }
}

main();
