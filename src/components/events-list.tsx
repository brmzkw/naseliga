import type { inferRouterOutputs } from '@trpc/server';
import type { naseligaRouter } from "../server/trpc/router/naseliga";

import { CircleFlag } from 'react-circle-flags'
import { PropsWithChildren } from 'react';
import React from 'react';

type EventsListProps = {
    events?: inferRouterOutputs<typeof naseligaRouter>['getEvents']
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
    return (
        <>
            <h2 className="font-bold text-xl">Last events</h2>
            <ul className="mt-2">
                {events?.map((event) =>
                    <li key={event.id}>
                        <Event event={event} />
                    </li>
                )}
            </ul>
        </>
    );
};

export default EventsList;

type EventProps = {
    event: NonNullable<EventsListProps["events"]>[number]
}

const Event: React.FC<EventProps> = ({ event }) => {
    const [clicked, setClicked] = React.useState(false);

    const numPlayers = [...new Set(
        event.matches.map((match) => [match.playerAId, match.playerBId]).flat()
    )].length;
    return (
        <>
            <div
                className="flex border-l-4 mt-4 border-l-purple-700 cursor-pointer hover:bg-purple-500 hover:text-white"
                onClick={() => setClicked((prev) => !prev)}
            >
                <div className="p-3 text-center">
                    <div>{event.date.toLocaleString('default', { month: 'short' })}</div>
                    <div className="font-bold text-2xl">{event.date.toLocaleString('default', { day: 'numeric' })}</div>
                </div>

                <div className="p-3">
                    <div>{numPlayers} players</div>
                    <div>{event.matches.length} matches</div>
                </div>
            </div>

            {clicked &&
                <table className="m-auto">
                    <tbody>
                        {event.matches.map((match) =>
                            <tr key={match.id} className={`border-b border-purple-700`}>
                                <td className={`flex items-center p-3 ${match.scoreA > match.scoreB ? 'font-bold' : ''}`}>
                                    <div className="w-8 mr-2">
                                        {match.playerA.country && <CircleFlag countryCode={match.playerA.country.toLowerCase()} />}
                                    </div>
                                    <div className="capitalize">{match.playerA.name}</div>
                                </td>
                                <td className={`p-3 ${match.scoreA > match.scoreB ? 'font-bold' : ''}`}>{match.scoreA}</td>

                                <td className={`flex items-center p-3 ${match.scoreB > match.scoreA ? 'font-bold' : ''}`}>
                                    <div className="w-8 mr-2">
                                        {match.playerB.country && <CircleFlag countryCode={match.playerB.country.toLowerCase()} />}
                                    </div>
                                    <div className="capitalize">{match.playerB.name}</div>
                                </td>
                                <td className={`p-3 ${match.scoreB > match.scoreA ? 'font-bold' : ''}`}>{match.scoreB}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
        </>
    );
};