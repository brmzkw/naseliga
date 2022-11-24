-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL DEFAULT '',
    "date" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "country" VARCHAR NOT NULL DEFAULT '',

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "event" INTEGER NOT NULL,
    "player_a" INTEGER NOT NULL,
    "player_b" INTEGER NOT NULL,
    "score_a" INTEGER NOT NULL,
    "score_b" INTEGER NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rankings" (
    "match" INTEGER NOT NULL,
    "rank_a" INTEGER NOT NULL,
    "rank_b" INTEGER NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("match")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_name_key" ON "players"("name");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "fk_event" FOREIGN KEY ("event") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "fk_player_a" FOREIGN KEY ("player_a") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "fk_player_b" FOREIGN KEY ("player_b") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "fk_event" FOREIGN KEY ("match") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
