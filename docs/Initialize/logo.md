# Logo handloing.

Default BC Docs comes set up with images from BC docs.
This can be override with values from settings.

to turn this features on you will need to go to settings in vscode.
**File-Preferences-Settings** here you will look for these settings:

**FavIconFile** 
    Put the path to a shared folder with the Favicon file this should be a .ico file.

**PDFCoverImagePNG**
    This file is the one that is used for the cover image when creating PDF this should be a .png
                                                                            
**LeftCornerLogoSVG**
    This is is the logo in the left corner of the documentation. This must be an svg file.

After this is setup then we can run the command with shift+P and select
    **MYH-CopyLogoFilesFromTemplate**

Then it should use your template files.


