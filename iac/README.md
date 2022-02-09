# Infrastructure as Code

Bicep template and guide for setting up the infrastructure of this system for Azure.

## How it works.

The following directory contains the Bicep\* for our standard web app setup.

- 1 Database server with 1 database
- 1 Windows Server
- 1 Backend Web App
- 1 Frontend Web App

Along with the IAC is also a PowerShell script for deploying the first infrastructure first time.
Please note that this script only works once and require that no existing Resource Group exists. [Read more in the section below](#Deployment_Script)

\*) BICEP is a higher level language for ARM (Azure Resource Manager) template.

### Parameters

- appName:
  App Name is for the unique name of the application. Following the naming convention of the resource group
  `Client_XXX_YYY` the App Name should be the `YYY` as the name of the project.
- techLead:
  Tech Lead is the Senior Developer who has answers for the tech usage of all resources.
- followupDate:
  A date in the future where this project is forecasted to have been closed and therefor when quarterly
  Azure cleanups happen should be checked with Tech Lead.

## Deployment Script

### Prerequisits

- PowerShell version 5.1+
- [GitHub CLI](https://cli.github.com/)
- [Azure Az PowerShell module](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps)
- [Bicep tools](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/install#windows) ((hint: just use the msi installer))

Before running the script you need to make sure you have singed in to both Azure and GitHub

`Connect-AzAccount -TenantId "1c625370-d511-4f3d-91ac-92dcb3f8f4a1"`
and
`gh auth login`

### Running the script

Executing the script run `.\deploy.ps1`

This script will do the following in order

1. Get the information for the required params. Please just answer the question in clear text. Dont worry about format.
   <br/>Example of concise answer:
   > **What environment are you setting up? Name:** dev
2. Create the resource group.
3. Create a Deployment resource (container for the template deployment) and initiate the deployment
4. Extract the publish secrets from the deployment
5. Set GitHub secrets required for the Azure Deployment CD
