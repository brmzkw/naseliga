import React from "react";

import { useSession } from "next-auth/react";

import { CircleFlag } from 'react-circle-flags'
import type { PlayerWithScore } from "../server/trpc/router/leaderboard";
import { UpdateButton } from "./buttons";
import { trpc } from "../utils/trpc";


type LeaderboardProps = {
    leaderboard?: PlayerWithScore[]
}

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => {
    const defaultData = Array.from(Array(10).keys()).map(() => null);
    const { data: sessionData } = useSession();

    return (
        <div className="flex flex-col items-center">
            {sessionData?.user?.isAdmin && <UpdateLeaderboardButton />}
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
        </div>
    );
};

export default Leaderboard;

const UpdateLeaderboardButton: React.FC = () => {
    const utils = trpc.useContext();
    const mutation = trpc.leaderboard.update.useMutation({
        onSuccess: () => {
            utils.leaderboard.invalidate();
        },
        onError: (err) => {
            console.error(err);
        },
    });

    const onClick = () => {
        mutation.mutate();
    }

    return (
        <UpdateButton onClick={onClick} />
    );
};