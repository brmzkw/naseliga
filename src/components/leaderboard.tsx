import React from "react";

import { CircleFlag } from 'react-circle-flags'
import type { PlayerWithScore } from "../server/trpc/router/naseliga";


type LeaderboardProps = {
    leaderboard?: PlayerWithScore[]
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
    const defaultData = Array.from(Array(10).keys()).map(() => null);

    return (
        <table className={`table-auto w-full ${leaderboard ? '' : 'animate-pulse'}`}>
            <tbody>
                {(leaderboard || defaultData).map((entry, idx) =>
                    <tr key={entry?.id || idx} className="border-b border-gray-300">
                        <td className="p-3">#{idx + 1}</td>
                        <td className="p-3 flex items-center">
                            <div className="w-5">{entry?.country && <CircleFlag countryCode={entry?.country.toLowerCase()} />}</div>
                            <span className="ml-2 capitalize">{entry?.name}</span>
                        </td>
                        <td className="font-bold">{entry?.score}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Leaderboard;