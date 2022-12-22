import React from "react";

import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import PlayerName from "./player-name";
import LeaderboardUpdateButton from "./leaderboard-update-button";
import LoadingSpinner from "./loading-spinner";

const Leaderboard: React.FC = () => {
    const { data: sessionData } = useSession();
    const query = trpc.leaderboard.get.useQuery();

    if (!query.data) {
        return <LoadingSpinner text="Loading leaderboard..." />;
    }

    return (
        <div className="flex flex-col items-center">
            {sessionData?.user?.isAdmin && <LeaderboardUpdateButton />}
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-red-300 text-center text-slate-700 font-bold">
                        <td colSpan={4} className="p-2">
                            Apparently there is an issue with the leaderboard and the results are not accurate. I'm working on a fix.
                        </td>
                    </tr>
                </thead>
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

export default Leaderboard;