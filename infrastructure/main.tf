terraform {
    required_providers {
        neon = {
            source  = "kislerdm/neon"
            version = "0.13.0"
        }
    }
}

provider "neon" {
    api_key = var.neon_api_key
}

resource "neon_project" "literary_travels" {
    name                      = "literary-travels-prod"
    history_retention_seconds = 21600
}

data "neon_branches" "all" {
    project_id = neon_project.literary_travels.id
}

data "neon_branch_endpoints" "all" {
    project_id = neon_project.literary_travels.id
    branch_id = [for b in data.neon_branches.all.branches : b.id if b.name == "main"][0]
}

resource "neon_role" "db_admin" {
    project_id = neon_project.literary_travels.id
    branch_id  = [for b in data.neon_branches.all.branches : b.id if b.name == "main"][0]
    name       = "lt_db_user"
}

resource "neon_database" "api_db" {
    project_id = neon_project.literary_travels.id
    branch_id  = [for b in data.neon_branches.all.branches : b.id if b.name == "main"][0]
    name       = "literary_travels"
    owner_name = neon_role.db_admin.name
}

locals {
  db_host   = data.neon_branch_endpoints.all.endpoints[0].host
  branch_id = [for b in data.neon_branches.all.branches : b.id if b.name == "main"][0]
}
