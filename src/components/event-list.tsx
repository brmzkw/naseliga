import React from "react";

import { useSession } from "next-auth/react";

import type { eventsRouter } from "../server/trpc/router/events";
import { trpc } from "../utils/trpc";
import { LoadingSpinner } from "./loading-spinner";
import type { inferRouterOutputs } from "@trpc/server";
import { EventRemoveButton } from "./event-remove-button";
import { EventCreateForm } from "./event-create-form";
import { MatchList } from "./match-list";

export const EventList: React.FC = () => {
  const query = trpc.events.list.useQuery();
  const { data: sessionData } = useSession();

  if (query.isLoading) {
    return <LoadingSpinner text="Loading events..." />;
  }

  return (
    <div className="flex flex-col gap-3 pl-2">
      {sessionData?.user?.isAdmin && (
        <>
          <h2 className="text-xl font-bold">Create a new event</h2>
          <EventCreateForm />
        </>
      )}

      <h2 className="text-xl font-bold">Last events</h2>
      <ul>
        {query.data?.map((event, idx) => (
          <li key={event.id} className="[&:not(:first-child)]:mt-4">
            <Event defaultOpen={idx == 0} event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
};

type EventProps = {
  defaultOpen: boolean;
  event: inferRouterOutputs<typeof eventsRouter>["list"][number];
};

const Event: React.FC<EventProps> = ({ defaultOpen, event }) => {
  const { data: sessionData } = useSession();

  const [clicked, setClicked] = React.useState(defaultOpen);
  const numPlayers = [
    ...new Set(
      event.matches.map((match) => [match.playerAId, match.playerBId]).flat()
    ),
  ].length;

  return (
    <>
      <div
        className="flex cursor-pointer items-center gap-5 border-l-4  border-l-purple-700 p-3 hover:bg-purple-500 hover:text-white"
        onClick={() => setClicked((prev) => !prev)}
      >
        <div className="text-center">
          <div>{event.date.toLocaleString("default", { month: "short" })}</div>
          <div className="text-2xl font-bold">
            {event.date.toLocaleString("default", { day: "numeric" })}
          </div>
        </div>

        <div>
          <div>{numPlayers} players</div>
          <div>{event.matches.length} matches</div>
        </div>

        <h4 className="text-bold text-2xl">{event.title}</h4>
      </div>

      {clicked && (
        <>
          {sessionData?.user?.isAdmin && (
            <div className="mt-3">
              <EventRemoveButton event={event} />
            </div>
          )}
          <MatchList event={event} />
        </>
      )}
    </>
  );
};
