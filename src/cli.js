
import inquirer from 'inquirer';
import chalk from 'chalk'
import path from "path";
import fs from "fs-extra";
import { generateImages } from './main'
const isImage = require("is-image")

const projectFiles = [
    'android',
    'ios',
    'package.json',
    'index.js',
];

const getiOSProjectName = dir => fs
    .readdirSync(dir)
    .filter(e => e.match(/.*\.(xcodeproj)/ig))
    .map(e => e.substring(0, e.indexOf('.xcodeproj')))[0];

async function promptForPathOptions() {

    const workingDirectory =
        process.env.INIT_CWD || process.env.PWD || process.cwd();

    const absProjectDirPath = path.resolve(workingDirectory)

    const withinValidProject = !projectFiles
        .map(projectFile => fs.existsSync(`${absProjectDirPath}${path.sep}${projectFile}`))
        .some(e => e === false);

    if (!withinValidProject) {
        console.log(chalk.red.bold("❌ You are not under a valid React Native project directory."))
        return
    }

    const answer = await inquirer.prompt({
        type: 'input',
        name: 'inputImgPath',
        message: 'Please enter splash image path :- ',
    });

    if (!isImage(answer["inputImgPath"].trim())) {
        console.log(chalk.red.bold("Not a valid image path.."))
        return
    }

    const iosFolderPath = `${absProjectDirPath}${path.sep}ios`;

    const iOSProjectDirPath = `${iosFolderPath}${path.sep}${getiOSProjectName(iosFolderPath)}`;

    const androidSrcMainDirPath = `${absProjectDirPath}${path.sep}android${path.sep}app${path.sep}src${path.sep}main`

    return {
        absProjectDirPath: absProjectDirPath,
        splashImgPath: answer["inputImgPath"].trim(),
        iOSProjectDirPath: iOSProjectDirPath,
        androidSrcMainDirPath: androidSrcMainDirPath,
    }
}

export async function cli(args) {
    const pathOptions = await promptForPathOptions(args);
    if (pathOptions) {
        generateImages(pathOptions.absProjectDirPath, pathOptions.splashImgPath, pathOptions.iOSProjectDirPath, pathOptions.androidSrcMainDirPath)   
    }
}