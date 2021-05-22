
import inquirer from 'inquirer';
import chalk from 'chalk'
import path from "path";
import { generateImages } from './main'
const isImage = require("is-image")

async function promptForPathOptions() {

    const answer1 = await inquirer.prompt({
        type: 'input',
        name: 'inputImgPath',
        message: 'Please enter a valid splash image path here:- ',
    });

    if (!isImage(answer1["inputImgPath"].trim())) {
        console.log(chalk.red.bold("Not a valid image path.."))
        return
    }

    const answer2 = await inquirer.prompt({
        type: 'input',
        name: 'inputIOSPath',
        message: 'Please enter valid iOS project path here',
    });

    const answer3 = await inquirer.prompt({
        type: 'confirm',
        name: 'isValidIOSPath',
        message: 'is this correct iOS project path? >> ' + answer2["inputIOSPath"],
    });

    if (!(answer3["isValidIOSPath"])) {
        return
    }

    const answer4 = await inquirer.prompt({
        type: 'input',
        name: 'inputAndroidPath',
        message: 'Please enter android source main directory path here(as follows : app/src/main)',
    });

    const answer5 = await inquirer.prompt({
        type: 'confirm',
        name: 'isValidAndroidPath',
        message: 'is this correct android source main directory path? >> ' + answer4["inputAndroidPath"],
    });

    if (!(answer5["isValidAndroidPath"])) {
        return
    }

    return {
        splashImgPath: answer1["inputImgPath"].trim(),
        iOSProjectPath: answer2["inputIOSPath"].trim(),
        androidSrcDirPath: answer4["inputAndroidPath"].trim(),
    }
}

export async function cli(args) {
    const pathOptions = await promptForPathOptions(args);
    if (pathOptions) {
        const workingDirectory =
        process.env.INIT_CWD || process.env.PWD || process.cwd();
        generateImages(workingDirectory, pathOptions.splashImgPath, pathOptions.iOSProjectPath, pathOptions.androidSrcDirPath)   
    }
}