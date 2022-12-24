import React from "react";

import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import PlayerName from "./player-name";
import LeaderboardUpdateButton from "./leaderboard-update-button";
import LoadingSpinner from "./loading-spinner";
import EventHistoryBrowser, { type NullableEvent } from "./event-history-browser";

const Leaderboard: React.FC = () => {
    return (
        <EventHistoryBrowser
            getTitle={(event, isLatest) => {
                if (isLatest) {
                    return <strong>Current leaderboard</strong>;
                }
                return <strong>
                    Leaderboard after {event.date.toLocaleString('default', { month: 'short' })} {event.date.toLocaleString('default', { day: 'numeric' })} {event.title && <>({event.title.trim()})</>}
                </strong>;
            }}
            getWrappedChildren={(event) => <LeaderboardContent event={event} />}
        />
    );
};

export default Leaderboard;

type LeaderboardContentProps = {
    event: NullableEvent;
};

const LeaderboardContent: React.FC<LeaderboardContentProps> = ({ event }) => {
    const { data: sessionData } = useSession();
    const query = trpc.leaderboard.get.useQuery({
        eventId: event?.id,
    });

    if (!query.data) {
        return <LoadingSpinner text="Loading leaderboard..." />;
    }

    return (
        <div className="flex flex-col items-center">
            {sessionData?.user?.isAdmin && <LeaderboardUpdateButton />}
            <table className="table-auto w-full">
                <tbody>
                    {query.data.leaderboard.map((entry, idx) =>
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
        </div>
    );
};