output "db_password: {
    value       = neon_role.db_admin.password
    sensitive   = true
}

output "db_host" {
    value       = neon_endpoint.primary_compute.host

}

output "database_url" {
    value       = "postgres://${neon_role.db_admin.name}:${neon_role.db_admin.password}@${neon_endpoint.primary_compute.host}/${neon_database.api_db.name}?sslmode=require"
    sensitive   = true
}
