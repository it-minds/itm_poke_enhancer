do {
  $Lead = Read-Host "Who is the product owner?
  Initials"

  $ok = $Lead -match '^\w{3,10}$'
  if ( -not $ok) {
    Write-Host "Invalid input"
    Start-Sleep 1
    Write-Host ""
  }
} until ($ok)

$Env = (Read-Host("What environment are you setting up? (dev/test/stg/prod)
  Name")).Replace(" ", "-").ToLower();

do {
  $Type = Read-Host "What type of application are you deploying?
  1 - Client, a product we are developing for a client with a contract
  2 - Internal, a product meant only for internal use without any public facing side
  3 - IT-Minds, a public product that presents IT Minds.

  Select number"

  $ok = $Type -match '^[1-3]+$'
  if ( -not $ok) {
    Write-Host "Invalid selection"
    Start-Sleep 1
    Write-Host ""
  }
} until ($ok)

if ($Type -eq "1") {
  $Client = (Read-Host("What is the client's name?")).Replace(" ", "-").ToLower();
}
else {
  $Client = ""
}

$Project = (Read-Host("What is the product/project's name?")).Replace(" ", "-").ToLower();

if ($Type -eq "1") {
  $FullName = "client_${Client}_${Project}";
}
if ($Type -eq "2") {
  $FullName = "internal_${Project}";
}
if ($Type -eq "3") {
  $FullName = "itm_${Project}";
}

Write-Host "Your Final Resource Group Name is: $FullName";
Write-Host "Your Final App Name is: $Project-$Env";

Read-Host("Continue? (point of no return)")

# From now on the user will stop commands mid process if they quit,
# resulting in half created resources that may have to be manually deleted.

$Today = Get-Date -Format "yyyy-MM-dd-HH-mm"

$RG = New-AzResourceGroup -Name $FullName -Location "West Europe" -Tag @{Lead = $Lead ; Department = "Delivery" ; Created = $Today }

$Suffix = Get-Random -Maximum 10000
$DeploymentName = "deployment_${RG.ResourceGroupName}_${Today}_${Suffix}"

Write-Host "Starting deployment: $DeploymentName"

New-AzResourceGroupDeployment `
  -ResourceGroupName $RG.ResourceGroupName `
  -Name $DeploymentName `
  -TemplateFile main.bicep `
  -appName "$Project-$Env" `
  -techLead $Lead
# TODO use -AsJob and wrap in a check that prints out a status every halfsecond. Like a loading bar

$fepb = Get-AzWebAppPublishingProfile `
  -ResourceGroupName $RG.ResourceGroupName `
  -Name "$Project-$Env-app"
  -Format "WebDeploy"

$bepb = Get-AzWebAppPublishingProfile `
  -ResourceGroupName $RG.ResourceGroupName `
  -Name "$Project-$Env-api"
  -Format "WebDeploy"

gh secret set AzureAppService_PublishProfile_Frontend -b $fepb
gh secret set AzureAppService_PublishProfile_Backend -b $bepb
gh secret set AzureAppService_AppName -b "$Project-$Env"
