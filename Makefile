all:
	@echo "Running service..."
	@docker-compose stop && docker-compose up --build -d --remove-orphans

db:
	@echo "Running Postgres service in detached mode..."
	@docker compose up -d db

front:
		cd client ; npm start

back:
		cd server ; npm run start:dev

local: db front back
	@echo "Running Local..."

down:
	@docker-compose -f ./docker-compose.yml down

re:
	@docker-compose -f ./docker-compose.yml up -d --build

list:
	@docker ps -a

list-networks:
	@docker network ls

clean-db:
	@echo "Cleaning database..."
	@docker-compose -f ./docker-compose.yml down -v

clean: down
	@-docker rmi -f `docker images -qa`
	@-docker volume rm `docker volume ls -q`

fclean: clean
	@echo "Cleaned !!"

.PHONY: all re down clean fclean
