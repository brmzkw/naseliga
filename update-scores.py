#!/usr/bin/env python3

from dataclasses import dataclass
from datetime import datetime, timedelta
import argparse


@dataclass
class score:
    player_a: str
    player_b: str
    score_a: int
    score_b: int


def parse_scores(stream):
    for line in stream:
        line = line.strip()
        player_a, player_b, score_a, score_b = line.split()
        yield score(
            player_a=player_a,
            player_b=player_b,
            score_a=score_a,
            score_b=score_b
        )


def generate_sql(scores, days_ago):
    date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
    yield f"INSERT INTO events(date) VALUES('{date}');"
    for score in scores:
        yield f"INSERT INTO players(name) VALUES('{score.player_a}') ON CONFLICT DO NOTHING;"
        yield f"INSERT INTO players(name) VALUES('{score.player_b}') ON CONFLICT DO NOTHING;"

        yield f'''
INSERT INTO matches(event, player_a, player_b, score_a, score_b)
VALUES(
    (SELECT id FROM events WHERE date = '{date}'),
    (SELECT id FROM players WHERE name = '{score.player_a}'),
    (SELECT id FROM players WHERE name = '{score.player_b}'),
    {score.score_a},
    {score.score_b}
);
'''



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', type=argparse.FileType('r'), required=True)
    parser.add_argument('-d', type=int, default=0)
    args = parser.parse_args()
    scores = parse_scores(args.f)
    queries = generate_sql(scores, args.d)
    print('\n'.join(queries))


if __name__ == '__main__':
    main()
