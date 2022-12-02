Prague squash club - https://naseliga.com

# How to start

* `npm install && npm run dev` to start the webserver
* `make run-db` to run the PostgreSQL database in Docker

To restore the database dump:

```
docker exec -i naseliga-db psql -U postgres naseliga < dump.sql
```