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
exports.FileTreeProvider = exports.FileItem = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FileItem extends vscode.TreeItem {
    isDirectory;
    constructor(label, collapsibleState, isDirectory, uri) {
        super(label, collapsibleState);
        this.tooltip = label;
        this.description = label;
        this.isDirectory = isDirectory || false;
        this.resourceUri = uri;
        let iconName = "file.svg";
        if (this.isDirectory) {
            iconName = "folder.svg";
        }
        if (typeof this.label === "string" && this.label.includes(".git")) {
            iconName = "git.svg";
        }
        if (typeof this.label === "string" && this.getExtension().includes("ts")) {
            iconName = "ts.svg";
        }
        this.iconPath = {
            light: path.join(__filename, "..", "..", "resources", "icons", iconName),
            dark: path.join(__filename, "..", "..", "resources", "icons", iconName),
        };
    }
    getExtension() {
        if (!this.isDirectory && typeof this.label === "string") {
            return path.extname(this.label);
        }
        return "";
    }
}
exports.FileItem = FileItem;
class FileTreeProvider {
    workspaceRoot;
    // Define the event emitter: When the tree data changes, the event emitter will notify the tree view
    _onDidChangeEvent = new vscode.EventEmitter();
    rootPath;
    onDidChangeTreeData;
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.onDidChangeTreeData = this._onDidChangeEvent.event;
        this.rootPath = workspaceRoot;
    }
    refresh() {
        this._onDidChangeEvent.fire();
    }
    // render tree item from the data
    getTreeItem(element) {
        if (!element.isDirectory) {
            element.command = {
                command: "notepad.openFile",
                title: "Open File",
                arguments: [element.resourceUri],
            };
        }
        return element;
    }
    getChildren(element) {
        if (!this.rootPath) {
            vscode.window.showInformationMessage("No folder or workspace opened");
            return Promise.resolve([]);
        }
        if (!element) {
            return Promise.resolve(this.getChildrenByPath(this.rootPath));
        }
        return Promise.resolve(this.getChildrenByPath(element.resourceUri?.fsPath));
    }
    getChildrenByPath(pathFile) {
        if (!pathFile || !this.pathExists(pathFile))
            return [];
        return fs
            .readdirSync(pathFile)
            .map((fileName) => {
            const filePath = path.join(pathFile, fileName);
            const stats = fs.statSync(filePath);
            const isDirectory = stats.isDirectory();
            const uri = vscode.Uri.file(filePath);
            return new FileItem(fileName, isDirectory
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None, isDirectory, uri);
        })
            .sort((a, b) => {
            if (a.isDirectory === b.isDirectory &&
                typeof a.label === "string" &&
                typeof b.label === "string") {
                return a.label.localeCompare(b.label);
            }
            return a.isDirectory ? -1 : 1;
        });
    }
    pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}
exports.FileTreeProvider = FileTreeProvider;
//# sourceMappingURL=file-tree.provider.js.map