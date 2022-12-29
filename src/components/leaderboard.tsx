import React from "react";

import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import PlayerName from "./player-name";
import LeaderboardUpdateButton from "./leaderboard-update-button";
import LoadingSpinner from "./loading-spinner";
import { EventsRouterOutput } from "../server/trpc/router/events";


type Event = EventsRouterOutput["list"][number];
type NullableEvent = Event | null;

const Leaderboard: React.FC = () => {
    const query = trpc.events.list.useQuery();

    const [selectedEvent, setSelectedEvent] = React.useState<NullableEvent>(null);

    const searchIdx = query.data?.findIndex((event) => event.id === selectedEvent?.id) ?? 0;
    const currentIdx = searchIdx === -1 ? 0 : searchIdx;

    const prevEvent = query.data?.[currentIdx + 1];
    const currentEvent = query.data?.[currentIdx];
    const nextEvent = query.data?.[currentIdx - 1];

    if (query.isLoading) {
        return <LoadingSpinner text="Loading events..." />;
    }

    return (
        <div>
            <div className="flex justify-around mb-2 p-2 shadow-md shadow-slate-900">
                <div>
                    {prevEvent && (
                        <button onClick={() => setSelectedEvent(prevEvent)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                        </button>
                    )}
                </div>
                <div className="flex-1 text-center">
                    {currentEvent && <Title event={currentEvent} isFirst={currentIdx === 0} />}
                </div>
                <div>
                    {nextEvent &&
                        <button onClick={() => setSelectedEvent(nextEvent)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    }
                </div>
            </div>
            <LeaderboardContent event={selectedEvent} />
        </div >
    );
};

type TitleProps = {
    event: Event;
    isFirst: boolean;
};

const Title : React.FC<TitleProps> = ({ event, isFirst }) => {
    const eventDate = `${event.date.toLocaleString('default', { month: 'short' })} ${event.date.toLocaleString('default', { day: 'numeric' })}`;
    const eventName = `${eventDate}${event.title ? ` (${event.title.trim()})` : ''}`;

    if (isFirst) {
        return <strong>Current leaderboard</strong>;
    }
    return <strong>Leaderboard on {eventName} </strong>;
};

export default Leaderboard;

type LeaderboardContentProps = {
    event: NullableEvent;
};

const LeaderboardContent: React.FC<LeaderboardContentProps> = ({ event }) => {
    const [includeInactivePlayers, setIncludeInactive] = React.useState(false);
    const { data: sessionData } = useSession();
    const query = trpc.leaderboard.get.useQuery({
        eventId: event?.id,
        includeInactivePlayers,
    });

    if (query.isLoading) {
        return <LoadingSpinner text="Loading leaderboard..." />;
    }

    return (
        <div className="flex flex-col items-center">
            {sessionData?.user?.isAdmin && <LeaderboardUpdateButton />}
            <table className="table-auto w-full">
                <tbody>
                    {query.data?.leaderboard.map((entry, idx) =>
                        <tr key={entry.id} className="border-b border-gray-300">
                            <td className="p-3">#{idx + 1}</td>
                            <td className="p-3 flex items-center">
                                <PlayerName player={entry} />
                            </td>
                            <td className="font-bold">{entry.score}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="self-end text-xs p-2 bg-slate-700 rounded-xl mt-2 text-white hover:bg-slate-500">
                <button onClick={() => setIncludeInactive((val) => !val)}>
                    {includeInactivePlayers ? "Hide inactive players" : "Show inactive players"}
                </button>
            </div>
        </div >
    );
};