import React from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { type NextPage } from "next";

import EventsList from "../components/events-list";
import Leaderboard from "../components/leaderboard";
import { trpc } from "../utils/trpc";
import { Caveat } from '@next/font/google'

const font = Caveat()

const HomePage: NextPage = () => {
  const leaderboardQuery = trpc.naseliga.getLeaderBoard.useQuery();
  const eventsQuery = trpc.naseliga.getEvents.useQuery();

  return (
    <>
      <Head>
        <title>Naseliga, our squash ligue in Prague</title>
        <meta name="description" content="Our squash ligue in Prague" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <menu className={`p-3 font-bold shadow-grey shadow-md text-center ${font.className} text-3xl`}>
        Naseliga, our squash ligue in Prague
      </menu>

      <main className="min-h-screen flex flex-col sm:flex-row">
        <div className="flex-1 mt-2">
          <Leaderboard leaderboard={leaderboardQuery.data?.leaderboard} />
        </div>
        <div className="flex-1 mt-5 sm:mt-2 ml-2">
          <EventsList events={eventsQuery.data} />
        </div>
      </main>
    </>
  );
}

export default HomePage;