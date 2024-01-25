import fs from "fs";
import {execSync} from "child_process";
import chalk from "chalk";


export default function folderCreating(packageManager, projectName){
    if(packageManager === "npm"){
        npmFolderCreating(projectName);
    }else if(packageManager === "yarn"){
        yarnFolderCreating(projectName);
    }else{
        console.log(chalk.red("Please select a package manager."));
        return;
    }
    console.log(chalk.green("Folder created successfully."));
}

function npmFolderCreating(projectName){
    try{
        fs.mkdirSync(projectName);
    }catch(err){
        console.log(chalk.red("Project already exists."));
        return;
    }
    process.chdir(projectName);
    execSync("npm init -y");
}

function yarnFolderCreating(projectName){
    try{
        fs.mkdirSync(projectName);
    }catch(err){
        console.log(chalk.red("Project already exists."));
        return;
    }
    process.chdir(projectName);
    execSync("yarn init -y");
}