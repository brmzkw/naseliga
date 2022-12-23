import React from 'react';

import { useSession } from 'next-auth/react';

import type { EventsRouterOutput, eventsRouter } from '../server/trpc/router/events';
import { trpc } from '../utils/trpc';
import PlayerName from './player-name';
import LoadingSpinner from './loading-spinner';
import type { inferRouterOutputs } from '@trpc/server';
import MatchCreateForm from './match-create-form';
import MatchRemoveButton from './match-remove-button';
import EventRemoveButton from './event-remove-button';
import EventCreateForm from './event-create-form';

const EventList: React.FC = () => {
    const query = trpc.events.list.useQuery();
    const { data: sessionData } = useSession();

    if (!query.data) {
        return <LoadingSpinner text="Loading events..." />;
    }

    return (
        <div className="flex flex-col gap-3 pl-2">
            {sessionData?.user?.isAdmin && (
                <>
                    <h2 className="font-bold text-xl">Create a new event</h2>
                    <EventCreateForm />
                </>
            )}

            <h2 className="font-bold text-xl">Last events</h2>
            <ul>
                {query.data.map((event, idx) =>
                    <li key={event.id} className="[&:not(:first-child)]:mt-4">
                        <Event defaultOpen={idx == 0} event={event} />
                    </li>
                )}
            </ul>
        </div>
    );
};

export default EventList;

type EventProps = {
    defaultOpen: boolean
    event: inferRouterOutputs<typeof eventsRouter>['list'][number];
}

const Event: React.FC<EventProps> = ({ defaultOpen, event }) => {
    const { data: sessionData } = useSession();

    const [clicked, setClicked] = React.useState(defaultOpen);

    const numPlayers = [...new Set(
        event.matches.map((match) => [match.playerAId, match.playerBId]).flat()
    )].length;
    return (
        <>
            <div
                className="flex gap-5 p-3 items-center border-l-4  border-l-purple-700 cursor-pointer hover:bg-purple-500 hover:text-white"
                onClick={() => setClicked((prev) => !prev)}
            >
                <div className="text-center">
                    <div>{event.date.toLocaleString('default', { month: 'short' })}</div>
                    <div className="font-bold text-2xl">{event.date.toLocaleString('default', { day: 'numeric' })}</div>
                </div>

                <div>
                    <div>{numPlayers} players</div>
                    <div>{event.matches.length} matches</div>
                </div>

                <h4 className="text-bold text-2xl">{event.title}</h4>
            </div>

            {clicked &&
                <>
                    {sessionData?.user?.isAdmin && <div className="mt-3">
                        <EventRemoveButton event={event} />
                    </div>
                    }
                    <MatchList event={event} />
                </>
            }
        </>
    );
};

type MatchListProps = {
    event: EventsRouterOutput["list"][number],
};

const MatchList: React.FC<MatchListProps> = ({ event }) => {
    const { data: sessionData } = useSession();
    return (
        <div>
            <table className="m-auto">
                <tbody>
                    {event.matches.map((match) =>
                        <tr key={match.id} className={`border-b border-purple-700 [&>td]:p-3`}>
                            <td className={`${match.scoreA > match.scoreB ? 'font-bold' : ''}`}>
                                <PlayerName player={match.playerA} />
                            </td>
                            <td className={`${match.scoreA > match.scoreB ? 'font-bold' : ''}`}>
                                {match.scoreA}
                                {match.ranking && (
                                    <>
                                        &nbsp;
                                        <small className="text-xs font-normal">({match.ranking.rankA >= 0 ? `+${match.ranking.rankA}` : match.ranking.rankA})</small>
                                    </>
                                )}
                            </td>

                            <td className={`${match.scoreB > match.scoreA ? 'font-bold' : ''}`}>
                                <PlayerName player={match.playerB} />
                            </td>
                            <td className={`${match.scoreB > match.scoreA ? 'font-bold' : ''}`}>
                                {match.scoreB}
                                {match.ranking && (
                                    <>
                                        &nbsp;
                                        <small className="text-xs font-normal">({match.ranking.rankB >= 0 ? `+${match.ranking.rankB}` : match.ranking.rankB})</small>
                                    </>
                                )}
                            </td>

                            {sessionData?.user?.isAdmin &&
                                <td>
                                    <MatchRemoveButton match={match} />
                                </td>
                            }
                        </tr>
                    )}
                </tbody>
            </table>

            {sessionData?.user?.isAdmin &&
                <div className="mt-4">
                    <hr />
                    <h4 className="text-xl text-center text-bold">Add a new match</h4>
                    <MatchCreateForm event={event} />
                    <hr />
                </div>
            }
        </div>
    );
};
