import React from 'react';

import { useSession } from 'next-auth/react';

import type { EventsRouterOutput } from '../server/trpc/router/events';
import PlayerName from './player-name';
import MatchCreateForm from './match-create-form';
import MatchRemoveButton from './match-remove-button';

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

export default MatchList;