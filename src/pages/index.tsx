import React from "react";

import { type NextPage } from "next";

import EventsList from "../components/events-list";
import Leaderboard from "../components/leaderboard";
import { trpc } from "../utils/trpc";

import BaseLayout from "../layouts/base";
import LoadingSpinner from "../components/loading-spinner";


const HomePage: NextPage = () => {
  const eventsQuery = trpc.events.list.useQuery();

  return (
    <BaseLayout>
      <div className="flex-1 mt-2">
        <Leaderboard />
      </div>
      <div className="flex-1 mt-5 sm:mt-2 ml-2 h-screen overflow-scroll">
        {eventsQuery.data ?
          <EventsList events={eventsQuery.data} />
          :
          <LoadingSpinner text="Loading events..." />
        }
      </div>
    </BaseLayout>
  );
}

export default HomePage;