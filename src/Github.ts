import * as vscode from 'vscode';
import { CreateFolder, writefile } from './FileFunctions';

export function CreateGithubWorkFlow() {
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
    const WorkflowContent = GetGithubWorkflowFile();
    const Filename = folder +   '/.github/workflows/DocFX.yml';
    writefile(Filename, WorkflowContent);
}

function GetGithubWorkflowFile(): string {
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