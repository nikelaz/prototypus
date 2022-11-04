import { promises as fs } from 'fs';
import child_process from 'child_process';
import { PROJECT_REPOSITORY } from '../config.js';
import { RESET_COLOR, BG } from '../constants/colors.js';
import { LOADING, DONE } from '../constants/symbols.js';

async function getDirExists(path) {
  try {
    await fs.stat(path);
    return true;
  } catch (error) {
    return false;
  }
}

function useColor(str, color) {
  return `${color} ${str}  ${RESET_COLOR}`;
}

async function createDirectory(dirName) {
  console.log(useColor(LOADING, BG.BLUE), `Creating Directory: ${dirName}`);

  await fs.mkdir(dirName);

  console.log(useColor(DONE, BG.GREEN), 'Directory Created Successfully');
}

function exec(command) {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}

async function installDependencies(dirName) {
  console.log(useColor(LOADING, BG.BLUE), `Installing Dependencies with NPM`);

  await exec(`cd ${dirName} && npm install`);

  console.log(useColor(DONE, BG.GREEN), `Dependencies Installed Successfully`);
}

async function cloneProjectTemplate(dirName) {
  console.log(useColor(LOADING, BG.BLUE), `Cloning Project Template from Repository`);

  await exec(`cd ${dirName} && git init && git pull ${PROJECT_REPOSITORY}`);

  console.log(useColor(DONE, BG.GREEN), `Project Template Cloned Successfully`);
}

async function main(dirName) {
  const dirExists = await getDirExists(dirName);
  
  if (dirExists) {
    throw new Error(`The "${dirName}" directory already exists. Prototypus cannot create a new project with the same directory name.`);
  }

  await createDirectory(dirName);

  await cloneProjectTemplate(dirName);

  await installDependencies(dirName);
}

export default main;
