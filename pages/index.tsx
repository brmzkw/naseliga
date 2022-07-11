import React from 'react';

import { GetStaticProps } from 'next'
import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';


import styles from '../styles/Home.module.css';

import EventsTable from '../components/EventsTable';
import LeaderBoardTable from '../components/LeaderBoardTable';
import Naseliga, { getEventsWithMatches, Event, LeaderBoardEntry } from '../lib/naseliga';
import { prisma } from '../db';

type PropsType = {
    leaderboard: LeaderBoardEntry[]
    events: Event[],
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
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  let events;

  try {
    events = await getEventsWithMatches();
  } finally {
    await prisma.$disconnect();
  }

  const naseliga = new Naseliga(events);

  return {
    props: {
      leaderboard: naseliga.leaderboard,
      events: naseliga.events,
    },
  }
}
