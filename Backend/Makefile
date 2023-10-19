all:
	@echo "Running Postgres service..."
	@docker compose up

db:
	@echo "Running Postgres service in detached mode..."
	@docker compose up -d db

down:
	@docker-compose -f ./docker-compose.yml down

re:
	@docker-compose -f ./docker-compose.yml up -d --build

update-hosts:
	@if ! grep -q "smodesto.42.fr" /etc/hosts; then \
		echo "127.0.0.1 smodesto.42.fr" >> /etc/hosts; \
	fi

remove-hosts:
	@if grep -q "smodesto.42.fr" /etc/hosts; then \
		sudo sed -i '/smodesto.42.fr/d' /etc/hosts; \
	fi

list:
	@docker ps -a

list-volumes:
	@docker volume ls

list-networks:
	@docker network ls

clean-db:
	@echo "Cleaning database..."
	@docker-compose -f ./docker-compose.yml down -v

prepare: clean-db re all
	@echo "Relaunched to test !"

clean: down
	@-docker rmi -f `docker images -qa`
	@-docker volume rm `docker volume ls -q`

fclean: clean
	@echo "Cleaned !!"

.PHONY: all re down clean fclean
