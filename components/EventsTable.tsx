import React from 'react';

import styles from '../styles/EventsTable.module.css';

import type { ListAllEvents } from '../db';

type MatchComponentPropsType = {
  match: ListAllEvents[number]['matches'][number],
}

function MatchComponent({ match }: MatchComponentPropsType) {
  return (
    <div className={styles.match}>
      <div className={styles.players}>
        <div className={match.scoreA > match.scoreB ? styles.winner : styles.loser}>{match.playerA.name}</div>
        <div className={match.scoreB > match.scoreA ? styles.winner : styles.loser}>{match.playerB.name}</div>
      </div>
      <div className={styles.scores}>
        <div>{match.scoreA}</div>
        <div>{match.scoreB}</div>
      </div>
    </div>
  );
}

type MatchesComponentPropsType = {
  matches: ListAllEvents[number]['matches'],
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

type EventComponentPropsType = React.PropsWithChildren<{date: Date}>

function EventComponent({ date, children }: EventComponentPropsType) {
  const [clicked, setClicked] = React.useState(false);
  const onClick = () => {
    setClicked((prev) => !prev);
  };

  const dateText = new Date(date).toLocaleDateString(
    'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      {!clicked && (<span>&rarr;</span>)}
      {clicked && (<span>&darr;</span>)}
      <button className={styles.button} onClick={onClick}>
        {dateText}
      </button>

      {clicked && children }
    </>
  );
}

type EventsTablePropsType = {
  events: ListAllEvents,
}

export default function EventsTable({ events }: EventsTablePropsType) {
  return (
    <div className={styles.container}>
      <h2>Matches</h2>
      {
        events.map((event) => (
          <div key={event.id}>
            <EventComponent date={event.date}>
              <MatchesComponent matches={event.matches} />
            </EventComponent>
          </div>
        ))
      }
    </div>
  );
}
