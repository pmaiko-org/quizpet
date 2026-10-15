COMPOSE_BASE = compose.yaml
COMPOSE_DEV  = compose.dev.yaml
COMPOSE_PROD = compose.prod.yaml

NETWORK_NAME = shared_network

DEV_COMPOSE  = docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV)
PROD_COMPOSE = docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_PROD)
ALL_COMPOSE  = docker compose --env-file .env -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) -f $(COMPOSE_PROD)

BUILD_TIMEOUT = 30m
LOCK_FILE = /tmp/quizpet-prod.lock
LOCK_TIMEOUT = 1800
LOCK_BUSY_CODE = 9

PROD_BUILD_SERVICES = backend cms frontend nginx
SEQUENTIAL_ENV = COMPOSE_BAKE=false COMPOSE_PARALLEL_LIMIT=1 DOCKER_BUILDKIT=1

.PHONY: dev prod prod-deploy prod-build down reset rebuild logs ps \
	precommit generate-cms-types check-rclone rclone-auth \
	cms-uploads-migrate create-network remove-network list-networks


# Development
dev: check-rclone
	docker volume ls -qf dangling=true | grep -E '^[0-9a-f]{64}$$' | xargs -r docker volume rm
	$(DEV_COMPOSE) up --build --remove-orphans --renew-anon-volumes


# Production
prod:
	@flock -E $(LOCK_BUSY_CODE) -w $(LOCK_TIMEOUT) $(LOCK_FILE) \
		$(MAKE) --no-print-directory prod-deploy; \
	status=$$?; \
	if [ $$status -eq $(LOCK_BUSY_CODE) ]; then \
		echo "Another production deploy is still holding $(LOCK_FILE) after $(LOCK_TIMEOUT)s"; \
	fi; \
	exit $$status

prod-deploy: create-network check-rclone
	$(PROD_COMPOSE) down --remove-orphans
	$(MAKE) --no-print-directory prod-build
	@echo "⚡ Starting containers..."
	$(SEQUENTIAL_ENV) $(PROD_COMPOSE) up -d --no-build --remove-orphans
	@echo "⚡ Cleaning old build cache (only unused layers older than 24h)..."
	docker builder prune -f --filter "until=24h"
	@echo "⚡ Removing dangling images..."
	docker image prune -f

prod-build:
	@for service in $(PROD_BUILD_SERVICES); do \
		echo "⚡ Building $$service..."; \
		$(SEQUENTIAL_ENV) timeout -k 30s $(BUILD_TIMEOUT) \
			$(PROD_COMPOSE) build $$service || exit 1; \
	done
	@echo "⚡ All images built"


# Docker
down:
	$(ALL_COMPOSE) down --remove-orphans

reset:
	$(ALL_COMPOSE) down --remove-orphans --volumes

rebuild:
	$(DEV_COMPOSE) build --no-cache

logs:
	$(DEV_COMPOSE) logs -f

ps:
	$(PROD_COMPOSE) ps


# Precommit
precommit:
	npm --prefix ./backend run precommit
	$(MAKE) generate-cms-types
	npm --prefix ./frontend run precommit
	npm --prefix ./cms run check:widgets
	npm --prefix ./cms run check:translations
	npm --prefix ./cms run test
	npm --prefix ./cms run typecheck


# CMS Types
generate-cms-types:
	npm --prefix ./cms run generate:types
	npm --prefix ./cms run generate:openapi
	npm --prefix ./frontend run generate:cms-api-types


# Rclone
check-rclone:
	@test -f rclone/rclone.conf || { \
		echo "rclone/rclone.conf is missing. Run 'make rclone-auth' and create the 'gdrive' remote first."; \
		exit 1; \
	}
	@echo "rclone config is ready"

rclone-auth:
	@mkdir -p rclone
	docker run --rm -it \
		-v "$(PWD)/rclone":/config/rclone \
		rclone/rclone config


# CMS Uploads Migration
cms-uploads-migrate: check-rclone
	@volume="$$(grep -E '^COMPOSE_PROJECT_NAME=' .env | cut -d= -f2)_cms-uploads"; \
	remote="$$(grep -E '^RCLONE_CMS_REMOTE=' .env | cut -d= -f2)"; \
	remote="$${remote:-gdrive:cms}"; \
	echo "Copying $$volume to $$remote"; \
	docker run --rm \
		-v "$$volume":/uploads:ro \
		-v "$(PWD)/rclone":/config/rclone \
		rclone/rclone copy /uploads "$$remote" --progress


# Networks
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