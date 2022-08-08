-- CreateTable
CREATE TABLE "rankings" (
    "match" INTEGER NOT NULL,
    "rank_a" INTEGER NOT NULL,
    "rank_b" INTEGER NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("match")
);

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "fk_event" FOREIGN KEY ("match") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
