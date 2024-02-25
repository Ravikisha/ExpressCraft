import fs from "fs";
import {execSync} from "child_process";


export default function folderCreating(packageManager, projectName){
    if(packageManager === "npm"){
        npmFolderCreating(projectName);
    }else if(packageManager === "yarn"){
        yarnFolderCreating(projectName);
    }else{
        console.log("❌ Please select a package manager.");
        return;
    }
    console.log("✅ Folder created successfully.");
}

function npmFolderCreating(projectName){
    try{
        fs.mkdirSync(projectName);
    }catch(err){
        console.log("❌ Project already exists.");
        return;
    }
    process.chdir(projectName);
    execSync("npm init -y");
}

function yarnFolderCreating(projectName){
    try{
        fs.mkdirSync(projectName);
    }catch(err){
        console.log("❌ Project already exists.");
        return;
    }
    process.chdir(projectName);
    execSync("yarn init -y");
}