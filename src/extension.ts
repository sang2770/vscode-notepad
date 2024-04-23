// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { FileTreeProvider } from "./file-tree.provider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const rootPath = !!vscode.workspace.workspaceFolders?.length
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";

  // register tree view data
  const fileTreeProvider = new FileTreeProvider(rootPath);

  vscode.window.registerTreeDataProvider("notepad", fileTreeProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
