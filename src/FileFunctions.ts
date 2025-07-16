import * as vscode from 'vscode';
import { CreateMainTocFile } from './TocFunctions';
import { CreateDocFXFileFULL } from './DocFXjson';
import { CopyOrCreateDefaultLogos} from './Logo';

export function GetActiveFilename() : string {
	const editor = vscode.window.activeTextEditor;
	var fileName = "";
	if (editor) {
	fileName = editor.document.fileName;
	vscode.window.showInformationMessage(`The file name of the current tab is ${fileName}.`);
	//To get the full path
	const fileUri = editor.document.uri;
	const filePath = fileUri.fsPath;
	}
	return fileName;
}

export function GetWorkspaceFolder(): string | undefined {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        return vscode.workspace.workspaceFolders[0].uri.path;
    }
    return undefined;
}

export function CreateFolder(workspaceFolder: string | undefined, NewFolderName: string): string {
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return '';
	}

	let Folder = `${workspaceFolder}/${NewFolderName}`;
	if (Folder.startsWith('/')) {
		Folder = Folder.slice(1);
	}
	const fs = require('fs');
	if (!fs.existsSync(Folder)) {
		fs.mkdirSync(Folder);
	}
	return Folder;
}

export function CreateFullFilename(folder : string, filename : string) : string
{
    var FullFilename = "";
    if (folder.endsWith("/"))
    {
        FullFilename = folder + filename;
    } 
    else
    {
        FullFilename = folder + "/" + filename;
    }

    return FullFilename;
}

export function writefile(filePath: string, content: string): void {
    const fs = require('fs');
    fs.writeFile(filePath, content, (err: any) => {
        if (err) {
            vscode.window.showErrorMessage(`Error writing file: ${err.message}`);
        } else {
            vscode.window.showInformationMessage(`File written successfully: ${filePath}`);
        }
    });
}

export function getDirectories(path: string) {
	const fs = require('fs');
	return fs.readdirSync(path).filter(function (file :string) {
		return fs.statSync(path+'/'+file).isDirectory();
  });
}

export function CreateIndexFile(docFolder : string,folder: string): void {
	let content = "# " + folder + "\n\n" + "Help documentation for " + folder;
	checkFileExistsSync(docFolder + '/' + folder + '/index.md') ? vscode.window.showInformationMessage('Index file already exists.') : writefile(docFolder + '/' + folder + '/index.md', content);
}

export function checkFileExistsSync(filePath: string): boolean {
	const { existsSync } = require('fs');
  return existsSync(filePath);
}

export function CreateMainIndexFile(docFolder : string): void {
	let content = "# Root Index\n\n" + "Help documentation for root";
	checkFileExistsSync(docFolder + '/index.md') ? vscode.window.showInformationMessage('Index file already exists.') : writefile(docFolder + '/index.md', content);
}

export function AppendToFile(filePath: string, content: string): void {
    const fs = require('fs');
    fs.appendFile(filePath, content, (err: any) => {
        if (err) {
            vscode.window.showErrorMessage(`Error appending to file: ${err.message}`);
        } else {
            vscode.window.showInformationMessage(`Content appended successfully to: ${filePath}`);
        }
    });
}

export function InitRepositoryForDocFX() {
           let folder: string | undefined = undefined;		
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            folder = vscode.workspace.workspaceFolders[0].uri.path;
        }
        const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
        const PDFSettingsFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').PDFSettingsFolder;
        const folderDocs = CreateFolder(folder,'docs');
        const folderMedia = CreateFolder(folderDocs, Mediafolder);
        const FolderPDFSettings = CreateFolder(folderDocs, PDFSettingsFolder);
        const HeaderFile = CreateFullFilename(FolderPDFSettings,'Header.txt');
        const FooterFile = CreateFullFilename(FolderPDFSettings,'Footer.txt');
   
        //writefile(HeaderFile,'');
        //writefile(FooterFile,'');
        CreateMainIndexFile(folderDocs);
        CreateMainTocFile(folderDocs);
        CopyOrCreateDefaultLogos();	
        CreateDocFXFileFULL(folderDocs); 
}

