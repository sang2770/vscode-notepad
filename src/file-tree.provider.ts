import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class FileItem extends vscode.TreeItem {
  isDirectory: boolean;
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    isDirectory?: boolean,
    uri?: vscode.Uri
  ) {
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

  getExtension(): string {
    if (!this.isDirectory && typeof this.label === "string") {
      return path.extname(this.label);
    }
    return "";
  }
}

export class FileTreeProvider implements vscode.TreeDataProvider<FileItem> {
  // Define the event emitter: When the tree data changes, the event emitter will notify the tree view
  private _onDidChangeEvent: vscode.EventEmitter<
    FileItem | FileItem[] | null | undefined | void
  > = new vscode.EventEmitter();
  private rootPath: string;
  onDidChangeTreeData?: vscode.Event<
    void | FileItem | FileItem[] | null | undefined
  >;

  constructor(private workspaceRoot: string) {
    this.onDidChangeTreeData = this._onDidChangeEvent.event;
    this.rootPath = workspaceRoot;
  }

  refresh(): void {
    this._onDidChangeEvent.fire();
  }

  // render tree item from the data
  getTreeItem(element: FileItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: FileItem | undefined
  ): vscode.ProviderResult<FileItem[]> {
    if (!this.rootPath) {
      vscode.window.showInformationMessage("No folder or workspace opened");
      return Promise.resolve([]);
    }
    if (!element) {
      return Promise.resolve(this.getChildrenByPath(this.rootPath));
    }
    console.log(element);
    return Promise.resolve(this.getChildrenByPath(element.resourceUri?.fsPath));
  }

  getChildrenByPath(pathFile?: string): FileItem[] {
    if (!pathFile || !this.pathExists(pathFile)) return [];
    return fs.readdirSync(pathFile).map((fileName) => {
      const filePath = path.join(pathFile, fileName);
      const stats = fs.statSync(filePath);
      const isDirectory = stats.isDirectory();
      const uri = vscode.Uri.file(filePath);
      return new FileItem(
        fileName,
        isDirectory
          ? vscode.TreeItemCollapsibleState.Collapsed
          : vscode.TreeItemCollapsibleState.None,
        isDirectory,
        uri
      );
    });
  }

  pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}
