# AAH-CLI Agent Development Guide

This document provides guidance for AI agents modifying or extending the Agent-Assisted Hypermedia Encoding CLI (AAH-CLI).

## Project Architecture

The project is structured into three main components:

1.  **`aah-cli.js` (The Dispatcher)**
    -   This is the main entry point for the CLI.
    -   It is responsible for parsing the top-level command (`encode`, `publish`) and dispatching control to the appropriate handler function.
    -   It uses a manual, minimalist argument parsing approach. Do not introduce complex parsing libraries like `yargs` unless absolutely necessary, as they have proven difficult to debug in this environment.
    -   Each command has a corresponding `handle...Command` function and a `print...Help` function.

2.  **`encoder.js` (The Core Logic)**
    -   This module contains the pure, dependency-free logic for the core task: compressing and encoding text.
    -   It exports a single function, `encode(text, algorithm)`.
    -   It uses Node.js's built-in `zlib` for Gzip compression and the `lzma-native` library for LZMA compression.
    -   If you need to add a new compression algorithm, add it here.

3.  **`publisher.js` (The Git Integration)**
    -   This module handles all interactions with Git and GitHub.
    -   It uses the `simple-git` library.
    -   It exports a single function, `publish(options)`, which performs the clone, edit, commit, and push sequence in a temporary directory.

## How to Extend the CLI

### Adding a New Command

1.  Add the new command name to the `switch` statement in the `main` function in `aah-cli.js`.
2.  Create a new `handleYourCommand(args)` function to contain the logic for the command.
3.  Create a `parseYourCommandArgs(args)` function to handle parsing its specific arguments.
4.  Create a `printYourCommandHelp()` function to display its help text.
5.  Update the main `printHelp()` function to include your new command.

### Modifying an Existing Command

-   Locate the appropriate `handle...Command` function in `aah-cli.js`.
-   If the change involves core encoding or publishing logic, modify the `encoder.js` or `publisher.js` modules respectively. Keep the concerns separated.

### Testing

-   The `publish` command is difficult to test in a sandboxed environment. Use "dry runs" that test the logic up to the point of the network call (e.g., `git clone` or `git push`).
-   For other commands, create temporary files and use `echo` to test all input methods (`--file`, `--text`, `stdin`).
-   Always clean up temporary files after your tests are complete.
