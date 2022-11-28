import { type NextPage } from "next";

import { CircleFlag } from 'react-circle-flags'

import BaseLayout from "../layouts/base";
import { trpc } from "../utils/trpc";

const EventsPage: NextPage = () => {
    const resp = trpc.naseliga.getEvents.useQuery();
    const events = resp.data || [];

    return (
        <BaseLayout>
            <div className="container max-w-sm">
                {events.map((event) =>
                    <div key={event.id} className="m-3 flex flex-col">
                        <h2 className="bg-zinc-100 p-3 rounded-full text-center font-bold">
                            {event.date.toLocaleString(
                                'en-US',
                                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                        </h2>
                        <table className="bg-zinc-50 mt-5 mb-5 rounded-lg">
                            <tbody>
                                {event.matches.map((match) =>
                                    <tr key={match.id} className="border-b-2">
                                        <td className="flex items-center p-3">
                                            <div className="w-8 mr-2">
                                                {match.playerA.country && <CircleFlag countryCode={match.playerA.country.toLowerCase()} />}
                                            </div>
                                            <div className="capitalize">{match.playerA.name}</div>
                                        </td>
                                        <td className="p-3">{match.scoreA}</td>
                                        <td className="flex items-center p-3">
                                            <div className="w-8 mr-2">
                                                {match.playerB.country && <CircleFlag countryCode={match.playerB.country.toLowerCase()} />}
                                            </div>
                                            <div className="capitalize">{match.playerB.name}</div>
                                        </td>
                                        <td className="p-3">{match.scoreB}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>)}
            </div>
        </BaseLayout>
    );
}

export default EventsPage;