"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const file_tree_provider_1 = require("./file-tree.provider");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    const rootPath = !!vscode.workspace.workspaceFolders?.length
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : "";
    // register tree view data
    const fileTreeProvider = new file_tree_provider_1.FileTreeProvider(rootPath);
    vscode.window.registerTreeDataProvider("notepad", fileTreeProvider);
    context.subscriptions.push(vscode.commands.registerCommand("notepad.openFile", (uri) => {
        vscode.workspace.openTextDocument(uri).then((doc) => {
            vscode.window.showTextDocument(doc);
        });
    }));
    const createTsFile = function (fileName, targetFolder) {
        if (!fileName)
            return;
        const filePath = `${targetFolder ?? rootPath}/${fileName}.ts`;
        vscode.workspace.fs
            .writeFile(vscode.Uri.file(filePath), new Uint8Array())
            .then(() => {
            fileTreeProvider.refresh();
        });
    };
    context.subscriptions.push(vscode.commands.registerCommand("notepad.createFileTs", () => {
        const focusedItemUri = vscode.window.activeTextEditor?.document.uri;
        const targetPath = focusedItemUri?.fsPath;
        const targetFolder = targetPath?.split("\\").slice(0, -1).join("\\");
        vscode.window
            .showInputBox({ prompt: "Enter file name" })
            .then((fileName) => {
            if (!fileName)
                return;
            createTsFile(fileName, targetFolder);
        });
    }));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map