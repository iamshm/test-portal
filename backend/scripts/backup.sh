#!/bin/bash

# Configuration
BACKUP_DIR="/Users/surajhm/projects/portal/backend/backups"
DB_NAME="faculty_portal"
BACKUP_RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"

# Create backup
pg_dump "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

# Remove backups older than retention period
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete

# Verify backup
if [ -f "${BACKUP_FILE}.gz" ]; then
    echo "Backup completed successfully: ${BACKUP_FILE}.gz"
else
    echo "Backup failed!"
    exit 1
fi 