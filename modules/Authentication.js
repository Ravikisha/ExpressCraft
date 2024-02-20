import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

class Authentication {
    constructor(authentication, packageManager) {
        this.authentication = authentication;
        this.packageManager = packageManager;
    }
}