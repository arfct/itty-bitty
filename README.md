# Agent-Assisted Hypermedia Encoding CLI (AAH-CLI)

AAH-CLI is a command-line tool designed to transform text into highly portable, self-contained URL fragments, inspired by the core functionality of `itty.bitty`. It allows you to take a piece of text or an entire file, compress it using Gzip or LZMA, and get a Base64-encoded string ready to be used in a URL.

This tool also provides a `publish` command to automate the process of adding your generated link to a file within a GitHub repository, streamlining the process of sharing your hypermedia content.

## Features

-   Compress and encode text using **Gzip** or **LZMA**.
-   Accepts input from files, direct text strings, or `stdin`.
-   **`encode` command**: Generates a raw Base64 URL fragment.
-   **`publish` command**: Encodes content and pushes a formatted link to a specified file in a GitHub repository.

## Installation

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Install the CLI globally or use `npm link` for development:
    ```bash
    npm link
    ```
    You can now use `aah-cli` from anywhere in your terminal.

## Usage

The CLI has two main commands: `encode` and `publish`.

### `encode`

This command takes your content and outputs the raw, compressed, Base64-encoded string to standard output.

**Usage:**
`aah-cli encode [options]`

**Options:**
-   `-f, --file <path>`: Path to the source file to encode.
-   `-t, --text <string>`: A direct string of text to encode.
-   `-a, --algorithm <type>`: The compression algorithm to use (`gzip` or `lzma`). Defaults to `gzip`.
-   `-h, --help`: Display help message.

**Examples:**

1.  **From a text string:**
    ```bash
    aah-cli encode --text "Hello, world!"
    ```
    *Output:* `eNrzSM3JyVcozy/KSQEAGgsEXQ==`

2.  **From a file:**
    ```bash
    aah-cli encode --file ./my-article.txt
    ```

3.  **From stdin:**
    ```bash
    cat my-article.txt | aah-cli encode
    ```

4.  **Using LZMA compression:**
    ```bash
    aah-cli encode --text "Hello, world!" --algorithm lzma
    ```

You can use the output to create an `itty.bitty` link like this: `https://itty.bitty.host/#/<output_string>`

### `publish`

This command encodes your content and then adds it as a link to a file in a remote GitHub repository.

**Prerequisites:**
You must have **Git** installed on your system. Your environment must be authenticated with GitHub (e.g., via SSH keys or a credential helper) so that you can push to the specified repository without interactive prompts.

**Usage:**
`aah-cli publish [options]`

**Options:**
-   Content (`--file` or `--text`): The content to encode.
-   `--repo <url>`: **Required.** The clone URL of the target GitHub repository.
-   `--path <filepath>`: **Required.** The path to the file to update within the repository (e.g., `README.md`).
-   `--branch <name>`: The target branch name. Defaults to `main`.
-   `--message <msg>`: The commit message.
-   `--algorithm <type>`: The compression algorithm. Defaults to `gzip`.

**Example:**
```bash
aah-cli publish \
  --text "This is my new blog post." \
  --repo "git@github.com:user/my-repo.git" \
  --path "links.md" \
  --branch "develop" \
  --message "Add new post link"
```
This will encode "This is my new blog post.", clone the `my-repo` repository, append a formatted `itty.bitty` link to `links.md`, and push the commit to the `develop` branch.
