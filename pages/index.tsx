import React from 'react';

import { GetStaticProps } from 'next'
import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';


import styles from '../styles/Home.module.css';

import EventsTable from '../components/EventsTable';
import LeaderBoardTable from '../components/LeaderBoardTable';

import {
  prisma,
  ListAllEvents,
  listAllEvents,
  ListLeaderboard,
  listLeaderboard,
} from '../db';

type PropsType = {
  leaderboard: ListLeaderboard,
  events: ListAllEvents
}

export default function Home({ leaderboard, events }: PropsType)  {
  return (
    <div className={styles.container}>
      <Head>
        <title>Naseliga - Prague Squash Club</title>
        <meta name="description" content="Prague Squash Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <LeaderBoardTable leaderboard={leaderboard} />
        <EventsTable events={events} />
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const leaderboard = await listLeaderboard();
    const events = await listAllEvents();
    return {
      props: {
        leaderboard,
        // events contains Date objects. Force conversion to strings, required
        // to serialize paramete given to the component.
        events: JSON.parse(JSON.stringify(events)),
      }
    };
  } finally {
    await prisma.$disconnect();
  }
}
