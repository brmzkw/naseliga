import React from 'react';

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import styles from '../styles/Home.module.css';

import LeaderBoard from '../components/LeaderBoard';


const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Naseliga - Prague Squash Club</title>
        <meta name="description" content="Prague Squash Club" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <LeaderBoard />
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
