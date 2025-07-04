import { GetActiveFilename } from "./FileFunctions";
import { GetWorkspaceFolder } from "./FileFunctions";
import { CreateFolder } from "./FileFunctions";
import { CreateFullFilename } from "./FileFunctions";
import { writefile } from "./FileFunctions";

function CreateRequestURL(Publisher : string, Group : string, Version : string, Entity : string, RequestType : string)
{
	if (RequestType === 'PATCH')
	{
		Entity += '({{id}})';
	}
	return`\n## Example Response for ${RequestType} Request\n\n### Request\n\n<https://api.businesscentral.dynamics.com/v2.0/{{Enviroment}}/api/${Publisher}/${Group}/${Version}/companies({{Company}})/${Entity}>\n\n### Response\n\n\`\`\`json\n\n\`\`\``;
}

export function CreateAPIDocumentation() : string {
    const FileName = GetActiveFilename();
    const WorkFolder = GetWorkspaceFolder();
    const TempDocFolder = CreateFolder(WorkFolder,'Temp');
    var TempDocFileName = CreateFullFilename(TempDocFolder, 'TempApiDoc.md');
    var DocTextLine = "";
    var PosStart = 0;
    var PosEnd = 0;
    var NewFileContent = "";
    var IsField = false;
    var IsFirstField = true;
    var APIPublisher = "", APIGroup = "", APIVersion = "", EntitySet = "";
    if (FileName.endsWith('.al'))
    {
        var fs = require('fs'),
            readline = require('readline');

        var rd = readline.createInterface({
            input: fs.createReadStream(FileName),
            output: process.stdout,
            console: false
        });

        rd.on('line', function(line : string) {
            if (line.indexOf('page ') !== -1)
            {
                PosStart = line.indexOf('"') + 1;
                PosEnd = line.length - 1;
                TempDocFileName = CreateFullFilename(TempDocFolder,(line.substring(PosStart, PosEnd) + '.md'));

            }
            if (line.indexOf('PageType') !== -1)
            {
                PosStart = line.indexOf('=') + 2;
                PosEnd = line.length - 1;
                DocTextLine += `- **Page Type**: ${line.substring(PosStart, PosEnd)}\n` ;
            }
            if (line.indexOf('APIVersion') !== -1)
            {
                PosStart = line.indexOf('=') + 3;
                PosEnd = line.length - 2;
                APIVersion = line.substring(PosStart, PosEnd);
                DocTextLine +=  `- **API Version**: ${APIVersion}\n`;
            }
            if (line.indexOf('APIPublisher') !== -1)
            {
                PosStart = line.indexOf('=') + 3;
                PosEnd = line.length - 2;
                APIPublisher = line.substring(PosStart, PosEnd);
                DocTextLine +=  `- **API Publisher**: ${APIPublisher}\n`;
            }
            if (line.indexOf('APIGroup') !== -1)
            {
                PosStart = line.indexOf('=') + 3;
                PosEnd = line.length - 2;
                APIGroup = line.substring(PosStart, PosEnd);
                DocTextLine +=  `- **API Group**: ${APIGroup}\n`;
            }
            if (line.indexOf('EntityName') !== -1)
            {
                PosStart = line.indexOf('=') + 3;
                PosEnd = line.length - 2;
                DocTextLine +=  `- **Entity Name**: ${line.substring(PosStart, PosEnd)}\n`;
            }
            if (line.indexOf('EntitySetName') !== -1)
            {
                PosStart = line.indexOf('=') + 3;
                PosEnd = line.length - 2;
                EntitySet = line.substring(PosStart, PosEnd);
                DocTextLine +=  `- **Entity Set Name**: ${EntitySet}\n`;
            }
            if (line.indexOf('ODataKeyFields') !== -1)
            {
                PosStart = line.indexOf('=') + 2;
                PosEnd = line.length - 1;
                DocTextLine +=  `- **OData Key Fields**: ${line.substring(PosStart, PosEnd)}\n`;
            }
            if (line.indexOf('SourceTable') !== -1)
            {
                PosStart = line.indexOf('=') + 2;
                PosEnd = line.length - 1;
                DocTextLine +=  `- **Source Table**: ${line.substring(PosStart, PosEnd)}\n`;
            }
            if (line.indexOf('Extensible') !== -1)
            {
                PosStart = line.indexOf('=') + 2;
                PosEnd = line.length - 1;
                DocTextLine += `- **Extensible**: ${line.substring(PosStart, PosEnd)}\n`;
            }
            if (line.indexOf('layout') !== -1)
            {
                NewFileContent = '# Name of API\n\n## Overview\n\nA brief description here\n\n## API Details\n\n';
                NewFileContent += DocTextLine +'\n\n';
                DocTextLine = "";

            }
            if (line.indexOf('area') !== -1)
            {
                PosStart = line.indexOf('(') + 2;
                //DocTextLine = line.substring(PosStart);
            }
            if (line.indexOf('repeater') !== -1)
            {
                PosStart = line.indexOf('(') + 2;
                //DocTextLine = line.substring(PosStart);
            }
            if (line.indexOf('field') !== -1)
            {
                IsField = true;
                if (IsFirstField === true)
                {
                    IsFirstField = false;
                    NewFileContent += CreateTableHeader(25,25,25);
                }
                PosStart = line.indexOf('(') + 1;
                PosEnd = line.indexOf(';');
                var Temp = `| ${line.substring(PosStart,PosEnd)} `;
                DocTextLine += Temp.padEnd(25,' ');
                PosStart = line.indexOf(';') + 6;
                PosEnd = line.indexOf(')');
                Temp =`| ${line.substring(PosStart,PosEnd)} `;
                DocTextLine += Temp.padEnd(25,' ');
            }
            if (line.indexOf('Caption') !== -1)
            {
                if (IsField === true)
                {
                    PosStart = line.indexOf('=') + 3;
                    PosEnd = line.length - 2;
                    Temp = `| ${line.substring(PosStart,PosEnd)}`;
                    DocTextLine += Temp.padEnd(25,' ') + `|\n`;
                    NewFileContent += DocTextLine;
                    DocTextLine = "";
                }

            }
        });

        rd.on('close', function() {
            console.log('all done, son');
            NewFileContent += CreateRequestURL(APIPublisher,APIGroup,APIVersion,EntitySet,'GET');
            NewFileContent += CreateRequestURL(APIPublisher,APIGroup,APIVersion,EntitySet,'POST');
            NewFileContent += CreateRequestURL(APIPublisher,APIGroup,APIVersion,EntitySet,'PATCH');
            writefile(TempDocFileName, NewFileContent);
        });
    }
    
    return TempDocFileName;
}

function CreateTableHeader(col1 : number, col2 : number, col3 : number) : string {
	var TableHeader = `## Fields
The following fields are exposed through the API:\n\n`;
	var columnName = "| Field Name ";
	TableHeader = columnName.padEnd(col1,' ');
	columnName = "| Source Field  ";
	TableHeader += columnName.padEnd(col2,' ');
	columnName = "| Caption ";
	TableHeader += columnName.padEnd(col3,' ') +'|\n';
	var columnName = "|----------";
	TableHeader += columnName.padEnd(col1,'-');
	columnName = "|----------";;
	TableHeader += columnName.padEnd(col2,'-');
	columnName = "|----------";;
	TableHeader += columnName.padEnd(col3,'-') +'|\n';

	return TableHeader;
}