terraform {
    required_providers {
        neon = {
            source  = "neondatabase/json"
            version = "~>0.4.0"
        }
    }
}

provider "neon" {
    api_key = var.neon_api_key
}

resource "neon_project" "literary_travels" {
    name                      = "literary-travels-prod"
    history_retention_seconds = 86400
}

resource "neon_branch" "main" {
    project_id = "neon_project.literary_travels.id"
    name       = "main"
}

resouce "neon_endpoint" "primary_compute" {
    project_id = neon_project.literary_travels.id
    branch_id  = neon_branch.main.id
    name       = "literary_travels"
    owner_name = neon_role.db_admin.name
}

resource neon_role "db_admin" {
    project_id = neon_project.literary_travels.id
    branch_id  = neon_branch.main.id
    name       = "lt_db_user"
}
