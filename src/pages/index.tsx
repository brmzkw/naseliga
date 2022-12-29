import React from "react";

import { type NextPage } from "next";

import { EventList } from "../components/event-list";
import { Leaderboard } from "../components/leaderboard";

import { BaseLayout } from "../layouts/base";

const HomePage: NextPage = () => {
  return (
    <BaseLayout>
      <div className="mt-2 flex-1 p-2">
        <Leaderboard />
      </div>
      <div className="mt-5 ml-2 h-[150vh] flex-1 overflow-scroll sm:mt-2">
        <EventList />
      </div>
    </BaseLayout>
  );
};

export default HomePage;
