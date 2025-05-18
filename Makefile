container_name = se-expense-node-api
container_command = docker container exec -it -u $(shell id -u) $(container_name)

migrate: 
	@echo "Migrating database..."
	$(container_command) npm run prisma:migrate:apply
	@echo "Database migrated"
	npm run prisma:generate
	@echo "Prisma client generated"

migrate-create: 
	@echo "Creating migration..."
	$(container_command) npm run prisma:migrate:create
	@echo "Migration created"

ACCOUNT_ID := $(shell aws sts get-caller-identity --query Account --output text)
REGION := us-east-1
REPO_NAME := expense-tracker-api
ECR_URI := $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(REPO_NAME)

ecr-update:
	docker build --platform linux/amd64 -t $(REPO_NAME) -f Dockerfile.prod .
	aws ecr get-login-password --region $(REGION) | docker login --username AWS --password-stdin $(ECR_URI)
	docker tag $(REPO_NAME):latest $(ECR_URI):latest
	docker push $(ECR_URI):latest

