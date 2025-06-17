# Name of the running container or service
SERVICE=fastapi  # Change to your Docker Compose service name if different
CMD=docker compose exec $(SERVICE)
# Use `docker exec` if not using docker-compose

# Path to Alembic config inside the container
ALEMBIC=uv run alembic
ALEMBIC_CONFIG=alembic.ini

# Create a new migration with a custom message
makemigration:
	@read -p "Enter migration message: " message; \
	$(CMD) $(ALEMBIC) -c $(ALEMBIC_CONFIG) revision --autogenerate -m "$$message"

# Upgrade to latest revision
upgrade:
	$(CMD) $(ALEMBIC) -c $(ALEMBIC_CONFIG) upgrade head

# Downgrade one revision
downgrade:
	$(CMD) $(ALEMBIC) -c $(ALEMBIC_CONFIG) downgrade -1

# Show current revision
current:
	$(CMD) $(ALEMBIC) -c $(ALEMBIC_CONFIG) current

# Show revision history
history:
	$(CMD) $(ALEMBIC) -c $(ALEMBIC_CONFIG) history

# Stamp DB with latest migration (without applying SQL)
stamp:
	$(CMD) $(ALEMBIC) -c $(ALEMBIC_CONFIG) stamp head
