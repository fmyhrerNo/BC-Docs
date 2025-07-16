# Github Pages

To get the github pages to be deployed a workflow is needed.
to create and add the workflow to this repo just go to the command palette ctrl+shift+P
type MYH and select this one:

![Github Workflow command](../media/cmdcreate-github-workflow.png)

This will create the **.github** and **workflow** folders.

![Github workflow folder](../media/folder-github-workflow.png)

In Github under **settings** in the repo you need to set these setting:

under **pages** you find the **source** field and here it should say **Github Actions**.

![Github Settings](../media/github-settings.png)

> [!NOTE]  
>Your documentation will now be automatic deployed to pages after each build.