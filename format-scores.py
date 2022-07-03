from datetime import date
import json
import sys


def main():
    data = {
        'date': date.today().strftime('%Y-%m-%d'),
        'matches': []
    }
    for line in sys.stdin.readlines():
        p1, p2, s1, s2 = line.split()
        data['matches'].append({
            'player_a': p1,
            'player_b': p2,
            'score_a': int(s1),
            'score_b': int(s2),
        })

    for line in json.dumps(data, indent=2).splitlines():
        print('  ' + line)


if __name__ == '__main__':
    main()
