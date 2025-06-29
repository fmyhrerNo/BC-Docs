// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { create } from 'domain';
import { fdatasync } from 'fs';
import { getDefaultSettings } from 'http2';
import { Context } from 'mocha';
import path from 'path';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "myhrer-bc-docs" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateDocFX-files', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
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
		vscode.window.showInformationMessage('Created and updated files for the docFX documentation.');
	});

	const disposable2 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateDocFxGithubWorkflow', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let folder: string | undefined = undefined;
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			folder = vscode.workspace.workspaceFolders[0].uri.path;
			if (folder.startsWith('/'))
			{
				folder = folder.substring(1);
			}
		}
		CreateFolder(folder, '.github');
		CreateFolder((folder + '/.github'), 'workflows');
		const WorkflowContent = GetGiithubWorkflowFile();
		const Filename = folder +   '/.github/workflows/DocFX.yml';
		writefile(Filename, WorkflowContent);

		vscode.window.showInformationMessage('Created folders for workflow and the workflow script.');
	});

	const disposable3 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateAndUpdateDocFxTocAndIndexFiles', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let folder: string | undefined = undefined;		
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			folder = vscode.workspace.workspaceFolders[0].uri.path;
		}
		const folderDocs = CreateFolder(folder,'docs');
		CreateTocFiles(folderDocs);
		CreateMainIndexFile(folderDocs);
		CreateMainTocFile(folderDocs);

		vscode.window.showInformationMessage('Created and updated table of contents and missing index.md files.');
	});

	const disposable4 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateAndOverwriteDocFx.json', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let folder: string | undefined = undefined;		
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			folder = vscode.workspace.workspaceFolders[0].uri.path;
		}
		const folderDocs = CreateFolder(folder,'docs');
		CreateDocFXFileFULL(folderDocs);
		vscode.window.showInformationMessage('Created or overwrited the DocFX.json file. the file is up to date!');
	});

	const disposable5 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-InitRepositoryForUseWithDocFX', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let folder: string | undefined = undefined;		
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			folder = vscode.workspace.workspaceFolders[0].uri.path;
		}
		const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
		const folderDocs = CreateFolder(folder,'docs');
		const folderMedia = CreateFolder(folderDocs, Mediafolder);
		const HeaderFile = CreateFullFilename(folderDocs,'Header.txt');
		const FooterFile = CreateFullFilename(folderDocs,'Footer.txt')

		writefile(HeaderFile,'');
		writefile(FooterFile,'');
		CreateMainIndexFile(folderDocs);
		CreateMainTocFile(folderDocs);		
		CreateDocFXFileFULL(folderDocs);


		vscode.window.showInformationMessage('Initilized the repo for use with DocFX');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWorkspaceFolder(): string | undefined {
	if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
		return vscode.workspace.workspaceFolders[0].uri.path;
	}
	return undefined;
}

function CreateFolder(workspaceFolder: string | undefined, NewFolderName: string): string {
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

function CreateDocFXFile(folder: string): void {
	var Content = "";
	const fs = require('fs');
	const filePath = `${folder}/docfx.json`;

	Content = GetDocFxFileBeginning();

	Content += CreateFolderContent(folder);
	Content += GetDocFxFileEnd();

	writefile(filePath, Content);

}

function CreateDocFXFileFULL(folder: string): void {
	var Content = "";
	var ReplaceContent = "";
	const fs = require('fs');
	const filePath = `${folder}/docfx.json`;	

	Content = GetDocFxFileFull();

	ReplaceContent = CreateFolderContent(folder);
	Content = Content.replace('{{FILES}}', ReplaceContent);
	ReplaceContent = CreateResorceFolderTag();
	Content = Content.replace('{{RESOURCEFILES}}', ReplaceContent);
	ReplaceContent = CreateAppLogoPathTag();
	Content = Content.replace('{{APPLOGOPATH}}', ReplaceContent);
	ReplaceContent = GetPdfSettings(folder);
	Content = Content.replace('{{PDF}}', ReplaceContent);
	ReplaceContent = GetDocFXOutputFolder();
	Content = Content.replace('{{_site}}', ReplaceContent);

	writefile(filePath, Content);

}

function CreateResorceFolderTag(): string {
	const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
	
	return `\"${Mediafolder}/**\"\n`;
}

function GetDocFXOutputFolder() : string {
	const DocFXOutputFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').DocFXOutputFolder;
	return DocFXOutputFolder;
}

function CreateAppLogoPathTag() : string {
	const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
	const LogoFileName = vscode.workspace.getConfiguration('myhrer-bc-docs').LogoFileName;
	return  `\"_appLogoPath\": \"${Mediafolder}\/${LogoFileName}\",`;	
}

function GetPDFValue(): string {
const CreatePDF = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePDF;

	if (CreatePDF === true)	{
		return "\t\t\t\t\"pdf\": true";
	}
	else {
		return "\t\t\t\t\"pdf\": false";
	}
}

function CreateFolderContent(folder: string) : string {
	var folderDataJson = '';
	var first = true;
	let directories = getDirectories(folder);
	const Mediafolder = vscode.workspace.getConfiguration('myhrer-bc-docs').MediaFolder;
  
	if (directories.length > 0) {
			for (var dir of directories) {
			if (dir !== Mediafolder) {	
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

function ListMDfiles(folder: string ): string {
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

function getDirectories(path: string) {
	const fs = require('fs');
	return fs.readdirSync(path).filter(function (file :string) {
		return fs.statSync(path+'/'+file).isDirectory();
  });
}

function WriteTocFile(folder: string, content: string): void {
	const fs = require('fs');
	const filePath = `${folder}/toc.yml`;
	writefile(filePath, content);
}
function writefile(filePath: string, content: string): void {
	const fs = require('fs');
	fs.writeFile(filePath, content, (err: any) => {
		if (err) {
			vscode.window.showErrorMessage(`Error writing file: ${err.message}`);
		} else {
			vscode.window.showInformationMessage(`File written successfully: ${filePath}`);
		}
	});
}
function AppendToFile(filePath: string, content: string): void {
	const fs = require('fs');
	fs.appendFile(filePath, content, (err: any) => {
		if (err) {
			vscode.window.showErrorMessage(`Error appending to file: ${err.message}`);
		} else {
			vscode.window.showInformationMessage(`Content appended successfully to: ${filePath}`);
		}
	});
}
function CreateTocFiles(docFolder: string): void {
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

function CreateTocFile(folder: string, dir: string): void {
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
function GetPdfSettings(docFolder: string) : string
{
	let PDFContent = "";
	PDFContent += GetPDFCoverPage();
	PDFContent += GetPDFTableOfContents();
	PDFContent += GetPDFHeaderTemplate(docFolder);
	PDFContent += GetPDFFooterTemplate(docFolder);
	PDFContent += GetPDFValue();
	return PDFContent;
}
function GetPDFCoverPage() : string
{
	var PdfValue = "";
	const CreatePDFCoverPage = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePDFCoverPage;
	if (CreatePDFCoverPage === true)
	{
		PdfValue += "\t\t\"pdfCoverPage\": \"cover.html\",\n";
	}
	return PdfValue;
}

function GetPDFTableOfContents() : string
{
	var PdfValue = "";
	const CreteTableOfContents = vscode.workspace.getConfiguration('myhrer-bc-docs').CreteTableOfContents;
	if (CreteTableOfContents === true)
	{
		PdfValue += "\t\t\t\t\"pdfTocPage\": true,\n";
	}
	return PdfValue;
}

function GetPDFHeaderTemplate(docFolder: string) : string
{
	let PdfValue = ""; 

	const CreatePdfHeader = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeader;
	const CreatePdfHeaderTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeaderTemplateText;
		let TemplateFile = CreateFullFilename(docFolder, CreatePdfHeaderTemplateText);
	if (CreatePdfHeader === true)
	{
		const Headertemplate = ReadExistingTocFile(TemplateFile);
		PdfValue +=    "\t\t\t\t\"pdfHeaderTemplate\": " + Headertemplate + ",\n";
      
	}
	return PdfValue;
}

function GetPDFFooterTemplate(docFolder: string) : string
{
	let PdfValue = ""; 

	const CreatePdfFooter = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooter;
	const CreatePdfFooterTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooterTemplateText;
		let TemplateFile = CreateFullFilename(docFolder, CreatePdfFooterTemplateText);
	if (CreatePdfFooter === true)
	{
		const Headertemplate = ReadExistingTocFile(TemplateFile);
		PdfValue +=    "\t\t\t\t\"pdfFooterTemplate\": " + Headertemplate + ",\n";      
	}
	return PdfValue;
}

function ReadExistingTocFile(tocFilePath: string): string {
	const fs = require('fs');
	let content = '';
	try {
		content = fs.readFileSync(tocFilePath, 'utf8');
	} catch (err: any) {
		vscode.window.showErrorMessage(`Error reading TOC file: ${err.message}`);
	}
	return content;
}

function CreateFullFilename(folder : string, filename : string) : string
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

function CreateIndexFile(docFolder : string,folder: string): void {
	let content = "# " + folder + "\n\n" + "Help documentation for " + folder;
	checkFileExistsSync(docFolder + '/' + folder + '/index.md') ? vscode.window.showInformationMessage('Index file already exists.') : writefile(docFolder + '/' + folder + '/index.md', content);
}

function CreateMainIndexFile(docFolder : string): void {
	let content = "# Root Index\n\n" + "Help documentation for root";
	checkFileExistsSync(docFolder + '/index.md') ? vscode.window.showInformationMessage('Index file already exists.') : writefile(docFolder + '/index.md', content);
}

function checkFileExistsSync(filePath: string): boolean {
	const { existsSync } = require('fs');
  return existsSync(filePath);
}

function CreateMainTocFile(docFolder: string): void {
	const TocFile = `${docFolder}/toc.yml`;
	let content = ListMDfiles(docFolder);
	checkFileExistsSync(TocFile) ? AppendToFile(TocFile, content) : writefile(TocFile, content);
	content = ListDirectoriesFiles(docFolder);
	if (content.length > 0) {
		AppendToFile(TocFile, content);
	}
}

function GetDocFxFileBeginning(): string {
	return `{
    "build": {
      "content": [
        {
          "files": [\n`;

}

function GetDocFxFileEnd(): string {
	return `\t\t\t\t\t]
        }
      ],
      "resource": [
        {
          "files": [
            "media/**"
          ]
        }
      ],
      "output": "_site",
      "globalMetadataFiles": [],
      "fileMetadataFiles": [],
      "template": [
        "default",
        "modern"
      ],
      "postProcessors": [],
      "keepFileLink": false,
      "globalMetadata": {
        "_appLogoPath": "media/logo.svg",
		\t\t"pdf": true
      },
      "disableGitFeatures": false
    }
  }`;
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
		{{PDF}}
      },
      "disableGitFeatures": false
    }
  }`;
}
  function GetGiithubWorkflowFile(): string {
	return `# Your GitHub workflow file under .github/workflows/
# Trigger the action on push to main
on:
  push:
    branches:
      - main

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  actions: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false
  
jobs:
  publish-docs:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Dotnet Setup
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.x

    - run: dotnet tool update -g docfx
    - run: docfx docs/docfx.json

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        # Upload entire repository
        path: './docs/_site'
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4`;
}
