import * as vscode from 'vscode';
import { AppendToFile, checkFileExistsSync, CreateFolder, CreateIndexFile, CreateMainIndexFile, getDirectories, writefile } from './FileFunctions';
export function ReadExistingTocFile(tocFilePath: string): string {
    const fs = require('fs');
    let content = '';
    try {
        content = fs.readFileSync(tocFilePath, 'utf8');
    } catch (err: any) {
       
    }
    return content;
}

function WriteTocFile(folder: string, content: string): void {
	const fs = require('fs');
	const filePath = `${folder}/toc.yml`;
	writefile(filePath, content);
}

export function CreateTocFile(folder: string, dir: string): void {
	const TocFile = `${folder}/${dir}/toc.yml`;
	const UseFolderAsPdfFilename = vscode.workspace.getConfiguration('myhrer-bc-docs').UseFolderAsPdfFilename;
	let content = "";

	if (UseFolderAsPdfFilename === true)
	{
		content += "pdfFileName: " + dir + ".pdf\n";
	}

	 content += ListMDfiles(folder + '/' + dir);
	


	checkFileExistsSync(TocFile) ? AppendToFile(TocFile, content) : writefile(TocFile, content);
}

function ListDirectoriesFiles(folder: string ): string {
    const fs = require('fs');
    var ExistingContent = '';
    var NewContent = '';
    let TocFile = folder + '/toc.yml';
    const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;

    if (checkFileExistsSync(TocFile) ){
        ExistingContent	= ReadExistingTocFile(TocFile);
    }
    const files = fs.readdirSync(folder);
    files.forEach((file: string) => {
        const stats = fs.statSync(folder + '/' + file);
        if (stats.isDirectory()) {
            if (file !== Mediafolder)
            {
                if (ExistingContent.indexOf(file) === -1) {
                    // folder is new, add it to the TOC
                    NewContent += `- name: ${file}\n  href: ${file}\\index.md\n`;
                }
            }
        }
    });
    return NewContent;
}

export function CreateMainTocFile(docFolder: string): void {
    const TocFile = `${docFolder}/toc.yml`;
    let content = ListMDfiles(docFolder);
    checkFileExistsSync(TocFile) ? AppendToFile(TocFile, content) : writefile(TocFile, content);
    content = ListDirectoriesFiles(docFolder);
    if (content.length > 0) {
        AppendToFile(TocFile, content);
    }
}
export function CreateTocFiles(docFolder: string): void {
	let directories = getDirectories(docFolder);
	const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;

	if (directories.length > 0) {
		for (var dir of directories) {

			if (dir !== Mediafolder) {
				CreateIndexFile(docFolder, dir);
				CreateTocFile(docFolder, dir);
			}
		}
	}
}
export function ListMDfiles(folder: string ): string {
    const fs = require('fs');
    const CoverPageFileName = vscode.workspace.getConfiguration('myhrer-bc-docs').CoverPageFileName;
    var ExistingContent = '';
    var NewContent = '';
    let TocFile = folder + '/toc.yml';

    if (checkFileExistsSync(TocFile) ){
        ExistingContent	= ReadExistingTocFile(TocFile);
    }
    const files = fs.readdirSync(folder);
    files.forEach((file: string) => {
        if (ExistingContent.indexOf(file) === -1 && file.endsWith('.md')) {
            if(ExistingContent.indexOf('items:') === -1)
            {
                NewContent += "items:\n";
            }
            // File is new, add it to the TOC
            if (!(CoverPageFileName === file))
            {
                NewContent += `- name: ${file}\n  href: ${file}\n`;
            }			
        }
    });
    return NewContent;
}

export function UpdateTocAndIndexFiles() {
    let folder: string | undefined = undefined;		
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        folder = vscode.workspace.workspaceFolders[0].uri.path;
    }
    const folderDocs = CreateFolder(folder,'docs');
    CreateTocFiles(folderDocs);
    CreateMainIndexFile(folderDocs);
    CreateMainTocFile(folderDocs);
}