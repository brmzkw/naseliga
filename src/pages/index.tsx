import React from "react";

import { type NextPage } from "next";

import EventList from "../components/event-list";
import Leaderboard from "../components/leaderboard";

import BaseLayout from "../layouts/base";


const HomePage: NextPage = () => {

  return (
    <BaseLayout>
      <div className="flex-1 mt-2 p-2">
        <Leaderboard />
      </div>
      <div className="flex-1 mt-5 sm:mt-2 ml-2 h-[150vh] overflow-scroll">
        <EventList />
      </div>
    </BaseLayout>
  );
}

export default HomePage;