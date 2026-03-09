output "db_host" {
    value = local.db_host
}

output "database_url" {
    value       = "postgres://${neon_role.db_admin.name}:${neon_role.db_admin.password}@${local.db_host}/${neon_database.api_db.name}?sslmode=require"
    sensitive   = true
}
