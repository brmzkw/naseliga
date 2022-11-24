DB_CONTAINER=naseliga-db
DB_REGEXP="DATABASE_URL=postgres:\/\/(.*):(.*)@(.*):(.*)\/(.*)"

DB_USER=$(shell sed -E -n 's/'${DB_REGEXP}'/\1/p' .env)
DB_PASSWORD=$(shell sed -E -n 's/'${DB_REGEXP}'/\2/p' .env)
DB_PORT=$(shell sed -E -n 's/'${DB_REGEXP}'/\4/p' .env)
DB_NAME=$(shell sed -E -n 's/'${DB_REGEXP}'/\5/p' .env)

run-db:
	@docker run -d --rm --name ${DB_CONTAINER} \
		-e POSTGRES_USER=${DB_USER} \
		-e POSTGRES_PASSWORD=${DB_PASSWORD} \
		-e POSTGRES_DB=${DB_NAME} \
		-p ${DB_PORT}:5432 \
		postgres

remove-db:
	@docker rm -f ${DB_CONTAINER}

reset-db: remove-db run-db