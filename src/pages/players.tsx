import React from "react";

import { type NextPage } from "next";

import EventsList from "../components/events-list";
import Leaderboard from "../components/leaderboard";
import { trpc } from "../utils/trpc";
import { Caveat } from '@next/font/google'

import BaseLayout from "../layouts/base";
import { CircleFlag } from "react-circle-flags";


const font = Caveat()

const PlayersPage: NextPage = () => {
    const playersQuery = trpc.naseliga.getPlayers.useQuery();

    return (
        <BaseLayout>
            <table className={`table-auto w-full ${playersQuery.data ? '' : 'animate-pulse'}`}>
                <tbody>
                    {playersQuery.data?.map((entry, idx) =>
                        <tr key={entry?.id || idx} className="border-b border-gray-300">
                            <td className="p-3 flex items-center">
                                <div className="w-5">{entry?.country && <CircleFlag countryCode={entry?.country.toLowerCase()} />}</div>
                                <span className="ml-2 capitalize">{entry?.name}</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </BaseLayout>
    );
}

export default PlayersPage;