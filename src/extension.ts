// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {exec} from 'child_process';
import { existsSync } from "node:fs";
const applescript = require('applescript');
const { useQspace} = vscode.workspace.getConfiguration('newnight');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('newnight.open', async (uri) => {
        var currentPath: string = "";
        let appName='';
        console.log(useQspace);
        if (useQspace && existsSync("/Applications/Qspace Pro.app")) {
            appName='Qspace Pro';
        }else if (useQspace && existsSync("/Applications/Qspace.app")) {
            appName='Qspace';
        }
        if (uri && uri.fsPath) {
            currentPath = uri.fsPath;
        }else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
            currentPath = vscode.window.activeTextEditor.document.fileName;
        }
        // pick workspace folders
        if (""===currentPath && vscode.workspace.workspaceFolders) {
            vscode.window.showWorkspaceFolderPick({placeHolder:"please choose a folder as 'Source Uri'"}).then(selection => { 
                // the user canceled the selection 
                if (!selection) { 
                    return; 
                } 
                currentPath = selection.uri.path;
            }); 
        } 
        if (""===currentPath) {
            vscode.window.showErrorMessage('There is no source Uri to compare');
            return;
        }
        if (!useQspace) {
            applescript.execString (`
                set thePath to POSIX file "${currentPath}"
                tell application "Finder"
                    reveal thePath
                    activate
                end tell
            `);
        }else if (useQspace && appName) {
            exec(`open -a "${appName}" "${currentPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.warn(`open exception -> ${error}`);
                }
                if (stderr) {
                    console.error(`open stderr -> ${stderr}`);
                }
                console.log(`open stdout -> ${stdout}`);
            });
        }
    }));
}

// This method is called when your extension is deactivated
export function deactivate() {}
