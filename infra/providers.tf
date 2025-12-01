terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}

  # Your subscription + tenant ID
  subscription_id = "355270ef-54eb-4324-8bcd-eb2fe20aee48"
  tenant_id       = "060b02ae-5775-4360-abba-e2e29cca6627"
}
