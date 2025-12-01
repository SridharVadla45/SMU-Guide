variable "project_name" {
  description = "Base name used to name all resources"
  type        = string
  default     = "smu-guide"
}

variable "location" {
  description = "Azure region for your resources"
  type        = string
  default     = "canadacentral"
}
