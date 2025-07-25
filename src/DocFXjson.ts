import { writefile,getDirectories, CreateIndexFile, CreateFolder, CreateMainIndexFile } from "./FileFunctions";
import * as vscode from 'vscode';
import { GetPdfSettings } from "./PdfFunctions";
import { CreateMainTocFile, CreateTocFiles } from "./TocFunctions";
import { create } from "domain";

export function CreateDoxFxJson () {
    let folder: string | undefined = undefined;
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        folder = vscode.workspace.workspaceFolders[0].uri.path;
    }
    const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
    const folderDocs = CreateFolder(folder,'docs');
    CreateFolder(folderDocs, Mediafolder);
    CreateTocFiles(folderDocs);
    CreateMainIndexFile(folderDocs);
    CreateMainTocFile(folderDocs);
    CreateDocFXFileFULL(folderDocs);
}
export function CreateDocFXFileFULL(folder: string): void {
    var Content = "";
    var ReplaceContent = "";
    const fs = require('fs');
    const filePath = `${folder}/docfx.json`;	

    Content = GetDocFxFileFull();

    ReplaceContent = CreateFolderContent(folder);
    Content = Content.replace('{{FILES}}', ReplaceContent);
    ReplaceContent = CreateResourceFolderTag();
    Content = Content.replace('{{RESOURCEFILES}}', ReplaceContent);
    ReplaceContent = CreateAppLogoPathTag();
    Content = Content.replace('{{APPLOGOPATH}}', ReplaceContent);
    ReplaceContent = CreateFavIconPathTag();
    Content = Content.replace('{{APPFAVICONPATH}}',ReplaceContent);
    ReplaceContent = GetPdfSettings(folder);
    Content = Content.replace('{{PDF}}', ReplaceContent);
    ReplaceContent = GetDocFXOutputFolder();
    Content = Content.replace('{{_site}}', ReplaceContent);

    writefile(filePath, Content);

}
function CreateFolderContent(folder: string) : string {
    var folderDataJson = '';
    var first = true;
    let directories = getDirectories(folder);
    const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
    const PDFSettingsFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').PDFSettingsFolder;
  
    if (directories.length > 0) {
            for (var dir of directories) {
            if ((dir !== Mediafolder) && (dir !== PDFSettingsFolder)) {	
                if (first === true)
                {
                    folderDataJson = folderDataJson +"\t\t\t\"" +dir + "\/**.md\",\n" + "\t\t\t\t\t\t\"" + dir + "\/**/toc.yml\",\n";
                    CreateIndexFile(folder, dir);
                    first = false;
                }
                else
                {
                    folderDataJson = folderDataJson +"\t\t\t\t\t\t\"" +dir + "\/**.md\",\n" + "\t\t\t\t\t\t\"" + dir + "\/**/toc.yml\",\n";
                    CreateIndexFile(folder, dir);
                }

            }
        }
        folderDataJson  += "\t\t\t\t\t\t\"" + "toc.yml\",\n" + "\t\t\t\t\t\t\"" + "*.md\"\n";
        
    }
    return folderDataJson;
}

function CreateResourceFolderTag(): string {
    const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
    
    return `\"${Mediafolder}/**\"\n`;
}

function CreateAppLogoPathTag() : string {
    const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
    const LogoFileName = vscode.workspace.getConfiguration('myhrer-bc-docs').LogoFileName;
    return  `\"_appLogoPath\": \"${Mediafolder}\/${LogoFileName}.svg\",`;	
}

function CreateFavIconPathTag() : string {
    const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
    return  `\"_appFaviconPath\": \"${Mediafolder}\/favicon.ico\",`;	
}

function GetDocFXOutputFolder() : string {
	const DocFXOutputFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').DocFXOutputFolder;
	return DocFXOutputFolder;
}

function GetDocFxFileFull(): string {
	return `{
    "build": {
      "content": [
        {
          "files": [
		  {{FILES}}\t\t\t\t\t]
        }
      ],
      "resource": [
        {
          "files": [
            {{RESOURCEFILES}}\t\t\t\t\t]
        }
      ],
      "output": "{{_site}}",
      "globalMetadataFiles": [],
      "fileMetadataFiles": [],
      "template": [
        "default",
        "modern"
      ],
      "postProcessors": [],
      "keepFileLink": false,
      "globalMetadata": {
        {{APPLOGOPATH}}
        {{APPFAVICONPATH}}
		{{PDF}}
      },
      "disableGitFeatures": false
    }
  }`;
}