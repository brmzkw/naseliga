import React from 'react';

import styles from '../styles/EventsTable.module.css';
import { Event, Match } from '../lib/naseliga';


type MatchComponentPropsType = {
  match: Match
}

function MatchComponent({ match }: MatchComponentPropsType) {
  return (
    <div className={styles.match}>
      <div className={styles.players}>
        <div className={match.score_a > match.score_b ? styles.winner : styles.loser}>{match.player_a}</div>
        <div className={match.score_b > match.score_a ? styles.winner : styles.loser}>{match.player_b}</div>
      </div>
      <div className={styles.scores}>
        <div>{match.score_a}</div>
        <div>{match.score_b}</div>
      </div>
    </div>
  );
}

type MatchesComponentPropsType = {
  matches: Match[]
}

function MatchesComponent({ matches }: MatchesComponentPropsType) {
  return (
    <ul className={styles.matches}>
      {
        matches.map((match, idx) => (
          <li key={idx}>
            <MatchComponent match={match} />
          </li>
        ))
      }
    </ul>
  );
}

type EventComponentPropsType = React.PropsWithChildren<{date: string}>

function EventComponent({ date, children }: EventComponentPropsType) {
  const [clicked, setClicked] = React.useState(false);
  const onClick = () => {
    setClicked((prev) => !prev);
  };

  return (
    <>
      {!clicked && (<span>&rarr;</span>)}
      {clicked && (<span>&darr;</span>)}
      <button className={styles.button} onClick={onClick}>
        {date}
      </button>

      {clicked && children }
    </>
  );
}

type EventsTablePropsType = {
  events: Event[]
}

export default function EventsTable({ events }: EventsTablePropsType) {
  return (
    <div className={styles.container}>
      <h2>Matches</h2>
      {
        events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
          <div key={event.date}>
            <EventComponent date={event.date}>
              <MatchesComponent matches={event.matches} />
            </EventComponent>
          </div>
        ))
      }
    </div>
  );
}
