import React from 'react';

import { GetStaticProps } from 'next'
import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';

import styles from '../styles/Home.module.css';

import LeaderBoardTable from '../components/LeaderBoardTable';
import Naseliga, { LeaderBoardEntry } from '../lib/naseliga';


type PropsType = {
    leaderboard: LeaderBoardEntry[]
}

export default function Home({ leaderboard }: PropsType)  {
  return (
    <div className={styles.container}>
      <Head>
        <title>Naseliga - Prague Squash Club</title>
        <meta name="description" content="Prague Squash Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <LeaderBoardTable leaderboard={leaderboard} />
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const naseliga = new Naseliga();

  return {
    props: {
      leaderboard: naseliga.leaderboard,
      events: naseliga.events,
    },
  }
}
