param appName string
param techLead string
param followupDate string = dateTimeAdd(utcNow('u'), 'P3M', 'yyy-MM-dd')

var sqlserverAdminLogin = 'l${uniqueString(resourceGroup().id)}'
var sqlserverAdminPassword = 'P${uniqueString(resourceGroup().id)}x!'

resource asp 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: '${appName}-plan'
  location: resourceGroup().location
  sku: {
    name: 'B1'
    capacity: 1
  }
  tags: {
    techLead: techLead
    followupDate: followupDate
    automated: 'template'
  }
}

resource dbserver 'Microsoft.Sql/servers@2021-05-01-preview' = {
  location: resourceGroup().location
  name: '${appName}-dbserv'
  properties: {
    administratorLogin: sqlserverAdminLogin
    administratorLoginPassword: sqlserverAdminPassword
  }
}

resource db 'Microsoft.Sql/servers/databases@2021-05-01-preview' = {
  name: '${appName}-db'
  parent: dbserver
  location: resourceGroup().location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  dependsOn: [
    dbserver
  ]
}

resource frontend 'Microsoft.Web/sites@2021-02-01' = {
  dependsOn: [
    asp
  ]
  location: resourceGroup().location
  name: '${appName}-app'
  properties: {
    serverFarmId: asp.id
    siteConfig: {
      appSettings: [
        {
          'name': 'WEBSITE_NODE_DEFAULT_VERSION'
          'value': '~16'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'BACKEND_URL'
          value: 'https://${appName}-api.azurewebsites.net'
        }
      ]
    }
  }
}

resource backend 'Microsoft.Web/sites@2021-02-01' = {
  dependsOn: [
    asp
    db
    frontend
  ]
  location: resourceGroup().location
  name: '${appName}-api'
  properties: {
    serverFarmId: asp.id
    siteConfig: {
      cors: {
        supportCredentials: true
        allowedOrigins: [
          'https://${appName}-app.azurewebsites.net'
        ]
      }
      netFrameworkVersion: 'v5.0'
      apiDefinition: {
        url: 'https://${appName}-api.azurewebsites.net/swagger/specification.json'
      }
      connectionStrings: [
        {
          name: 'DefaultConnection'
          type: 'SQLServer'
          connectionString: 'Server=tcp:${reference(dbserver.id).fullyQualifiedDomainName},1433;Initial Catalog=${db.name};Persist Security Info=False;User ID=${sqlserverAdminLogin};Password=${sqlserverAdminPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
        }
      ]
      appSettings: [
        {
          name: 'Serilog:MinimumLevel'
          value: 'Information'
        }
      ]
    }
  }
}
