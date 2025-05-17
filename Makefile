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


