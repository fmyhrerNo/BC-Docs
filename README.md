# Myhrer BC Docs

This extension is intended to be a helper for the documentation part. It will initialize the repo for use with DocFX.And it creates a workflow for Github so it will be rebuilt after each pull request.
functionality in this extension will help you manage the PDF settings too.

## File Functions
- Create workflow for use in Github
- Create and updates DocFX.json
- Create and updates toc.yml filer

## Pdf features
- Turn on and off PDF download
- Cover page
- Table of Contents (toc)
- creates header and footer text on the PDF pages.
-
Please visit https://www.myhrer.net/ for more in depth information and tips and tricks in Business Central.

in the ctrl-shift-P it is added this commands:

### MYH: Initialize Repository For Use With DocFX
    This command will initialize the repo for use and creates a docs folder in the root of the workspace folder.

### MYH: Create DocFX Github Workflow

    This command will create a workflow file in the repo under
    .github/workflow
    This will be executed when a new build is created.
    This should be done one time for each repo.

### MYH: Create and Update All DocFX files
    This command Create or update all relevant DocFx files
    - updates toc.yml
    - Creates missing index files
    - updates DocFX with changes in folders and toc.yml
    This function are also in the right click menu in the file explorer window.

### MYH: Create And Update DocFX Toc And Index files
    This command will update all the toc and index files and folders.
    This function are also in the right click menu in the file explorer window.

### MYH: Setup and create PDF cover page
    This command will create the template files for a PDF cover page.
    If file already exist will it not be overwritten. the cover page can be edited as you like.

### MYH: Create PDF header and footer
    This command will create templates in the PDF settings folder for header and footer text in the PDF.

### MYH: Create API documentation for the active document
    This command will create an template for use for documentation of API pages.
    the file is created in a folder named  **temp**  and then you can move the file to the correct folder.
    This function are also in the right click menu in the editor window if the file is an .al file.

## Settings
    In the preferences you will find these settings:

### CreatePDF
    This turns on and off the PDF creation.

### MediaFolder
    This sets the name of the media folder where you store the images used in the documentation.
    Default is **media**

### LogoFileName
    This tells the docfx which file is to be used in the top left corner on the documentation site.

### DocFXOutputFolder
    This is the output folder where DocFX creates the files before it is published on the github pages.
    Default is **_site**

### CreteTableOfContents
    This will create table of contents (toc) in beginning of the PDF document.  

### CreatePDFCoverPage
    This tuns on and off the functionality for having a cover page on the automatic created PDFs.

### CoverPageFileName
    Sets the filename of the cover page. Default is cover.md.

### UseFolderAsPdfFilename
    This setting tuned on will use the foldername as the filename of the created PDF.
    If not tuned on it will crete the files as toc.pdf.

### CreatePdfHeader
    This turns PDF header on and of. if on it will look for the template files in the PDF files directory.

### CreatePdfHeaderTemplateText
    This is the name of the PDF header template text file. This file contains a div tag for setting header text on the PDF pages.

### CreatePdfFooter
    This turns PDF footer on and of. if on it will look for the template files in the PDF files directory.

### CreatePdfFooterTemplateText
    This is the name of the PDF footer template text file. This file contains a div tag for setting header text on the PDF pages.

### PDFSettingsFolder
    This is the name used on the folder containing the PDF settings files like the header and footer text.

