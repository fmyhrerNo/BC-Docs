import { create } from 'domain';
import { fdatasync } from 'fs';
import { getDefaultSettings } from 'http2';
import { Context } from 'mocha';
import path from 'path';
import { IntervalHistogram } from 'perf_hooks';
import * as vscode from 'vscode';
import { CreateAPIDocumentation } from './ApiDocumentator';
import { CreateFolder, CreateFullFilename, CreateIndexFile, CreateMainIndexFile, getDirectories, InitRepositoryForDocFX, writefile } from './FileFunctions';
import { CreateFooterAndHeaderTemplates, GetDemoPDFPageFooterData, GetDemoPDFPageHeaderData, GetPDFCoverPageData, SetupAndCreateCoverPage, SetupAndCreatePDFHeaderAndFooter } from './PdfFunctions';
import { CreateMainTocFile, CreateTocFile, UpdateTocAndIndexFiles } from './TocFunctions';
import { CreateDocFXFileFULL, CreateDoxFxJson } from './DocFXjson';
import { CreateGithubWorkFlow} from './Github';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "BC-docs" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateAndUpdateAllDocFX-files', () => {
		CreateDoxFxJson();
		vscode.window.showInformationMessage('Created and updated files for the docFX documentation.');
	});

	const disposable2 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateDocFxGithubWorkflow', () => {
		CreateGithubWorkFlow();
		vscode.window.showInformationMessage('Created folders for workflow and the workflow script.');
	});

	const disposable3 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateAndUpdateDocFxTocAndIndexFiles', () => {
		UpdateTocAndIndexFiles();
		vscode.window.showInformationMessage('Created and updated table of contents and missing index.md files.');
	});

	const disposable5 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-InitRepositoryForUseWithDocFX', () => {
		InitRepositoryForDocFX();
		vscode.window.showInformationMessage('Initilized the repo for use with DocFX');
	});

	const disposable6 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-SetupAndCreateCoverPage', () => {
		SetupAndCreateCoverPage();	
	});

	const disposable7 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-SetupAndCreatePDFHeaderAndFooter', () => {
		SetupAndCreatePDFHeaderAndFooter();
	});

	const disposable8 = vscode.commands.registerCommand('myhrer-bc-docs.MYH-CreateApiDopcumentation', () => {
		const filename = CreateAPIDocumentation();
		vscode.window.showInformationMessage('Creted API Documentation for ' + filename);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

