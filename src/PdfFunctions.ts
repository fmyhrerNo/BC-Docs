
import { CreateFolder, CreateFullFilename, writefile } from './FileFunctions';
import * as vscode from 'vscode';
import { ReadExistingTocFile } from './TocFunctions';

export function GetPdfSettings(docFolder: string) : string
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
    const PDFSettingsFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').PDFSettingsFolder;
    const CreatePdfHeader = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeader;
    const CreatePdfHeaderTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeaderTemplateText;
   const FolderPDFSettings = CreateFolder(docFolder,PDFSettingsFolder);
    let TemplateFile = CreateFullFilename(FolderPDFSettings, CreatePdfHeaderTemplateText);
    const Headertemplate = ReadExistingTocFile(TemplateFile);

    if ((CreatePdfHeader === true) && (Headertemplate !== ''))
    {
        
        PdfValue +=    "\t\t\t\t\"pdfHeaderTemplate\": " + Headertemplate + ",\n";
      
    }
    return PdfValue;
}

function GetPDFFooterTemplate(docFolder: string) : string
{
    let PdfValue = ""; 
    const PDFSettingsFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').PDFSettingsFolder;
    const CreatePdfFooter = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooter;
    const CreatePdfFooterTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooterTemplateText;
    const FolderPDFSettings = CreateFolder(docFolder,PDFSettingsFolder);
    let TemplateFile = CreateFullFilename(FolderPDFSettings, CreatePdfFooterTemplateText);
    const Headertemplate = ReadExistingTocFile(TemplateFile);

    if ((CreatePdfFooter === true) && (Headertemplate !== ''))
    {
        
        PdfValue +=    "\t\t\t\t\"pdfFooterTemplate\": " + Headertemplate + ",\n";      
    }
    return PdfValue;
}

function CreatePDFHeaderFooter(folder : string)
{
        const PDFSettingsFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').PDFSettingsFolder;
        const CreatePdfHeader = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeader;
        const CreatePdfFooter = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooter;
        const CreatePdfHeaderTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeaderTemplateText;
        const CreatePdfFooterTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooterTemplateText;
        const folderDocs = CreateFolder(folder,'docs');

        if ((CreatePdfHeader === true) && (CreatePdfHeaderTemplateText !== ''))
        {	
            const DemoData = GetDemoPDFPageHeaderData();	
            CreateFooterAndHeaderTemplates(folderDocs,CreatePdfHeader,CreatePdfHeaderTemplateText, PDFSettingsFolder,DemoData);	
        }

        
        if ((CreatePdfFooter === true) && (CreatePdfFooterTemplateText !== ''))
        {
            const DemoData = GetDemoPDFPageFooterData();	
            CreateFooterAndHeaderTemplates(folderDocs,CreatePdfFooter,CreatePdfFooterTemplateText, PDFSettingsFolder,DemoData);	
        }
}

export function CreateFooterAndHeaderTemplates(folder : string,CreatePdfFooterHeader : boolean, CreatePdfFooterHeaderTemplateText :string, PDFSettingsFolder :string, PageFooterHeaderData : string)
{
        if ((CreatePdfFooterHeader === true) && (CreatePdfFooterHeaderTemplateText !== ''))
        {
            const folderPdfSettings = CreateFolder(folder,PDFSettingsFolder);
            const PdfFooterHeaderFile = CreateFullFilename(folderPdfSettings, CreatePdfFooterHeaderTemplateText);
            writefile(PdfFooterHeaderFile, PageFooterHeaderData);
            vscode.window.showInformationMessage(`Created or overwrited the ${PdfFooterHeaderFile} file.`);
        }
        else
        {
            vscode.window.showErrorMessage('PDF settings are incomplete please check the PDF settings in settings.');
        }
}

export function SetupAndCreateCoverPage() {
    let folder: string | undefined = undefined;		
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        folder = vscode.workspace.workspaceFolders[0].uri.path;
    }
    const CreatePDFCoverPage = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePDFCoverPage;
    const CoverPageFileName = vscode.workspace.getConfiguration('myhrer-bc-docs').CoverPageFileName;

    if ((CreatePDFCoverPage === true) && (CoverPageFileName !== ''))
    {
    const folderDocs = CreateFolder(folder,'docs');
    const CoverpageFile = CreateFullFilename(folderDocs, CoverPageFileName);
    const CoverpageData = GetPDFCoverPageData();
    writefile(CoverpageFile, CoverpageData);
        vscode.window.showInformationMessage(`Created or overwrited the ${CoverpageFile} file.`);
    }
    else
    {
        vscode.window.showInformationMessage('PDF Coverpage is not turned on or the Cover page filename is empty in the settings. Please check the settings for PDF Cover Page');
    }
}

export function SetupAndCreatePDFHeaderAndFooter() {
    		let folder: string | undefined = undefined;		
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			folder = vscode.workspace.workspaceFolders[0].uri.path;
		}
		const PDFSettingsFolder = vscode.workspace.getConfiguration('myhrer-bc-docs').PDFSettingsFolder;
		const CreatePdfHeader = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeader;
		const CreatePdfFooter = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooter;
		const CreatePdfHeaderTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfHeaderTemplateText;
		const CreatePdfFooterTemplateText = vscode.workspace.getConfiguration('myhrer-bc-docs').CreatePdfFooterTemplateText;
		const folderDocs = CreateFolder(folder,'docs');

		if ((CreatePdfHeader === true) && (CreatePdfHeaderTemplateText !== ''))
		{	
			const DemoData = GetDemoPDFPageHeaderData();	
			CreateFooterAndHeaderTemplates(folderDocs,CreatePdfHeader,CreatePdfHeaderTemplateText, PDFSettingsFolder,DemoData);	
		}
		
		if ((CreatePdfFooter === true) && (CreatePdfFooterTemplateText !== ''))
		{
			const DemoData = GetDemoPDFPageFooterData();	
			CreateFooterAndHeaderTemplates(folderDocs,CreatePdfFooter,CreatePdfFooterTemplateText, PDFSettingsFolder,DemoData);	
		}
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

export function GetDemoPDFPageFooterData() : string{
	return `"<div style=\"width: 100%; font-size: 12px;\"><div style=\"text-align: center; padding: 0 2em\"<p>BC Docs sample page footer<\/p><span class=\"pageNumber\"></span> / <span class=\"totalPages\"><\/span><\/div><\/div>"`;
}

export function GetDemoPDFPageHeaderData() : string{
	return `"<div style=\"width: 100%; font-size: 22px;\"><div style=\"text-align: center; padding: 0 2em\"<p>BC Docs sample page header<\/p><\/div><\/div>"`;
}

export function GetPDFCoverPageData() : string {
	return `<style>    
@media print {
    @page {
        margin: 0 !important;
    }
    body {
        -webkit-print-color-adjust: exact;
        -moz-print-color-adjust: exact;
        -ms-print-color-adjust: exact;
        print-color-adjust: exact;
    },
    .center {
        text-align: center;
        margin: auto;
        width: 50%;
        border: 3px solid green;
    }
}
</style>
<div style="background-image: url('../media/logo.png'); background-repeat: no-repeat; background-position: center; background-size: cover; width: 100%; height: 100%; display: flex; flex-direction: column">
<br><br><br><br><br><br><br>
<div style="text-align: center; margin: auto;   width: 50%; border: 3px solid green;">
  <p>Welcome to BC Docs</p>
</div>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<div style="text-align: center; margin: auto;   width: 50%; border: 3px solid green;">
  <p>Documentation generated by BC Docs</p>
</div>
  <p style='flex: 1'></p>
  <h1 style='align-self: end; margin: 1rem 2rem; color: blue'>BC Docs</h1>
</div>`;
}