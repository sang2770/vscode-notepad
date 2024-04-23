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

  context.subscriptions.push(
    vscode.commands.registerCommand("notepad.openFile", (uri: vscode.Uri) => {
      vscode.workspace.openTextDocument(uri).then((doc) => {
        vscode.window.showTextDocument(doc);
      });
    })
  );

  const createTsFile = function (
    fileName: string,
    targetFolder?: string
  ): void {
    if (!fileName) return;
    const filePath = `${targetFolder ?? rootPath}/${fileName}.ts`;
    vscode.workspace.fs
      .writeFile(vscode.Uri.file(filePath), new Uint8Array())
      .then(() => {
        fileTreeProvider.refresh();
      });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("notepad.createFileTs", () => {
      const focusedItemUri = vscode.window.activeTextEditor?.document.uri;
      const targetPath = focusedItemUri?.fsPath;
      const targetFolder = targetPath?.split("\\").slice(0, -1).join("\\");
      vscode.window
        .showInputBox({ prompt: "Enter file name" })
        .then((fileName) => {
          if (!fileName) return;
          createTsFile(fileName, targetFolder);
        });
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
