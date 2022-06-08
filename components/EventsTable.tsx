import React from 'react';

import styles from '../styles/EventsTable.module.css';
import { Event, Match } from '../lib/naseliga';


type MatchComponentPropsType = {
  match: Match
}

function MatchComponent({ match }: MatchComponentPropsType) {
  return (
    <>
      <span className={styles.playerName}>{match.player_a}</span> / <span className={styles.playerName}>{match.player_b}</span>: {match.score_a} / {match.score_b}
    </>
  );
}

type MatchesComponentPropsType = {
  matches: Match[]
}

function MatchesComponent({ matches }: MatchesComponentPropsType) {
  return (
    <ul>
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
      <button className={styles.button} onClick={onClick}>
        {!clicked && (<span>&rarr;</span>)}
        {clicked && (<span>&darr;</span>)}
        &nbsp;
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
        events.map((event) => (
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
