import React from "react";

import { type NextPage } from "next";

import EventsList from "../components/events-list";
import Leaderboard from "../components/leaderboard";
import { trpc } from "../utils/trpc";
import { Caveat } from '@next/font/google'

import BaseLayout from "../layouts/base";


const font = Caveat()

const HomePage: NextPage = () => {
  const leaderboardQuery = trpc.leaderboard.get.useQuery();
  const eventsQuery = trpc.events.list.useQuery();

  return (
    <BaseLayout>
      <div className="flex-1 mt-2">
        <Leaderboard leaderboard={leaderboardQuery.data?.leaderboard} />
      </div>
      <div className="flex-1 mt-5 sm:mt-2 ml-2 h-[calc(100vh*0.9)] overflow-scroll">
        <EventsList events={eventsQuery.data} />
      </div>
    </BaseLayout>
  );
}

export default HomePage;