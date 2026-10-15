COMPOSE_BASE = compose.yaml
COMPOSE_DEV  = compose.dev.yaml
COMPOSE_PROD = compose.prod.yaml
NETWORK_NAME = shared_network

.PHONY: dev prod down reset rebuild logs ps precommit generate-cms-types check-rclone rclone-auth cms-uploads-migrate

dev: check-rclone
	docker volume ls -qf dangling=true | xargs -r docker volume rm
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) up --build --remove-orphans --renew-anon-volumes

prod: create-network check-rclone
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) -f $(COMPOSE_PROD) down
	COMPOSE_PARALLEL_LIMIT=1 docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) build
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_PROD) up -d --remove-orphans
	@echo "⚡ Cleaning old build cache (only unused layers older than 24h)..."
	docker builder prune -f --filter "until=24h"
	@echo "⚡ Removing dangling images..."
	docker image prune -f

down:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) -f $(COMPOSE_PROD) down --remove-orphans

reset:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) -f $(COMPOSE_PROD) down --remove-orphans --volumes

rebuild:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) build --no-cache

logs:
	docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) logs -f

ps:
	docker compose ps

precommit:
	npm --prefix ./backend run precommit
	$(MAKE) generate-cms-types
	npm --prefix ./frontend run precommit
	npm --prefix ./cms run check:widgets
	npm --prefix ./cms run check:translations
	npm --prefix ./cms run test
	npm --prefix ./cms run typecheck

generate-cms-types:
	npm --prefix ./cms run generate:types
	npm --prefix ./cms run generate:openapi
	npm --prefix ./frontend run generate:cms-api-types

check-rclone:
	@test -f rclone/rclone.conf || { \
		echo "rclone/rclone.conf is missing. Run 'make rclone-auth' and create the 'gdrive' remote first."; \
		exit 1; \
	}
	@echo "rclone config is ready"

rclone-auth:
	@mkdir -p rclone
	docker run --rm -it -v "$(PWD)/rclone":/config/rclone rclone/rclone config

cms-uploads-migrate: check-rclone
	@volume="$$(grep -E '^COMPOSE_PROJECT_NAME=' .env | cut -d= -f2)_cms-uploads"; \
	remote="$$(grep -E '^RCLONE_CMS_REMOTE=' .env | cut -d= -f2)"; \
	remote="$${remote:-gdrive:cms}"; \
	echo "Copying $$volume to $$remote"; \
	docker run --rm \
		-v "$$volume":/uploads:ro \
		-v "$(PWD)/rclone":/config/rclone \
		rclone/rclone copy /uploads "$$remote" --progress

create-network:
	@docker network inspect $(NETWORK_NAME) > /dev/null 2>&1 || \
	docker network create $(NETWORK_NAME)
	@echo "Network '$(NETWORK_NAME)' is ready"

remove-network:
	@docker network rm $(NETWORK_NAME) 2>/dev/null || \
	echo "Network '$(NETWORK_NAME)' does not exist"
	@echo "Network '$(NETWORK_NAME)' removed"

list-networks:
	@docker network ls
