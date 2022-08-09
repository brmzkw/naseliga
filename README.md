Source code of [naseliga.com](https://naseliga.com)

### Configuration

Put the following content in `.env`:

```
DATABASE_URL="postgres://<porduction database URI>"
SHADOW_DATABASE_URL="postgres://postgres:password@localhost:5432/shadow"
```

### Update scores

Insert new matches in database with [./insert-scores.py](insert-scores.py) then compute the new rankings:

```
$> npm run update-rankings
```

### Generate migration

Run the shadow database:

```
$> docker run -d --rm -ti -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=shadow postgres
```

Make your changes in [prisma/schema.prisma](prisma/schema.prisma), and run:

```
$> npx prisma migrate dev --name '<migration title>' --preview-feature
```
