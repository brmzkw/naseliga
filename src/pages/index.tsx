import React from "react";

import Head from "next/head";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import EventsList from "../components/events-list";
import Leaderboard from "../components/leaderboard";
import { trpc } from "../utils/trpc";
import { Caveat } from '@next/font/google'


const font = Caveat()

const HomePage: NextPage = () => {
  const leaderboardQuery = trpc.naseliga.getLeaderBoard.useQuery();
  const eventsQuery = trpc.naseliga.getEvents.useQuery();
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Naseliga, our squash ligue in Prague</title>
        <meta name="description" content="Our squash ligue in Prague" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <menu className={`
        p-3 font-bold shadow-grey shadow-md
        ${font.className} text-3xl
        flex
      `}>
        <div className="flex-1 text-center">
          Naseliga, our squash ligue in Prague
        </div>

        <button onClick={sessionData ? () => signOut() : () => signIn("github")}>
          <img
            className="rounded-full h-10 w-10"
            src={(sessionData?.user?.image && sessionData.user.image) || "/GitHub-Mark/PNG/GitHub-Mark-64px.png"}
            alt="Profile picture"
          />
        </button>

      </menu>

      <main className="min-h-screen flex flex-col sm:flex-row">
        <div className="flex-1 mt-2">
          <Leaderboard leaderboard={leaderboardQuery.data?.leaderboard} />
        </div>
        <div className="flex-1 mt-5 sm:mt-2 ml-2 h-[calc(100vh*0.9)] overflow-scroll">
          <EventsList events={eventsQuery.data} />
        </div>
      </main>
    </>
  );
}

export default HomePage;