output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "Name of the resource group"
}

output "webapp_name" {
  value       = azurerm_linux_web_app.webapp.name
  description = "Name of the web app"
}

output "webapp_url" {
  value       = azurerm_linux_web_app.webapp.default_hostname
  description = "Default hostname of the web app"
}
