import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * Publishes content to a file in a GitHub repository.
 * @param {object} options - The publishing options.
 * @param {string} options.repoUrl - The URL of the target GitHub repository.
 * @param {string} options.filePath - The path to the file to update in the repo.
 * @param {string} options.contentToAppend - The content to append to the file.
 * @param {string} [options.branch='main'] - The target branch name.
 * @param {string} [options.commitMessage] - The commit message.
 * @returns {Promise<void>}
 */
export async function publish({
  repoUrl,
  filePath,
  contentToAppend,
  branch = 'main',
  commitMessage = `docs: Add new encoded link via AAH-CLI`,
}) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aah-cli-git-'));
  console.log(`Cloning ${repoUrl} into ${tempDir}...`);

  try {
    const git = simpleGit(tempDir);
    await git.clone(repoUrl, '.');
    await git.checkout(branch);

    console.log(`Appending content to ${filePath}...`);
    const absoluteFilePath = path.join(tempDir, filePath);
    await fs.appendFile(absoluteFilePath, contentToAppend + '\n');

    console.log('Committing and pushing changes...');
    await git.add(filePath);
    const commitResult = await git.commit(commitMessage);

    if (commitResult.commit) {
      await git.push('origin', branch);
      console.log('Successfully published changes!');
    } else {
      console.log('No changes to commit.');
    }

  } catch (error) {
    console.error(`Failed to publish to GitHub: ${error.message}`);
    throw error; // Re-throw the error to be caught by the calling command handler
  } finally {
    // console.log(`Cleaning up temporary directory: ${tempDir}`);
    // await fs.rm(tempDir, { recursive: true, force: true });
  }
}
