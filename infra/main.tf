# Resource group
resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-rg"
  location = var.location
}

# Random suffix to make names unique
resource "random_string" "suffix" {
  length  = 4
  upper   = false
  special = false
}

# App Service Plan (Linux)
resource "azurerm_service_plan" "app_service_plan" {
  name                = "${var.project_name}-asp-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  os_type  = "Linux"
  sku_name = "B1" # Basic plan, you can change later
}

# Web App (Linux)
resource "azurerm_linux_web_app" "webapp" {
  name                = "${var.project_name}-app-${random_string.suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.app_service_plan.id

  site_config {
    always_on = true
  }

  https_only = true
}
