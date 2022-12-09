import React from 'react';

import { useSession } from 'next-auth/react';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { CircleFlag } from 'react-circle-flags'

import { eventsRouter, type EventsRouterInput } from '../server/trpc/router/events';
import { AddButton } from './buttons';
import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';

type EventsListProps = {
    events?: inferRouterOutputs<typeof eventsRouter>['list']
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
    const { data: sessionData } = useSession();
    const defaultData = Array.from(Array(10).keys()).map(() => null);

    return (
        <div className="flex flex-col gap-3">
            {sessionData?.user?.isAdmin && (
                <>
                    <h2 className="font-bold text-xl">Create a new event</h2>
                    <NewEvent />
                </>
            )}

            <h2 className="font-bold text-xl">Last events</h2>
            <ul className="mt-2">
                {(events || defaultData).map((event, idx) =>
                    <li key={event?.id || idx}>
                        <Event defaultOpen={idx == 0} event={event} />
                    </li>
                )}
            </ul>
        </div>
    );
};

export default EventsList;

type EventProps = {
    defaultOpen: boolean,
    event: NonNullable<EventsListProps["events"]>[number] | null,
}

const Event: React.FC<EventProps> = ({ defaultOpen, event }) => {
    const [clicked, setClicked] = React.useState(defaultOpen);

    const numPlayers = [...new Set(
        event?.matches.map((match) => [match.playerAId, match.playerBId]).flat()
    )].length;
    return (
        <>
            <div
                className={`flex gap-5 p-3 items-center border-l-4 mt-4 border-l-purple-700 cursor-pointer hover:bg-purple-500 hover:text-white ${event || 'animate-pulse'}`}
                onClick={() => setClicked((prev) => !prev)}
            >
                <div className="text-center">
                    <div>{event?.date.toLocaleString('default', { month: 'short' })}</div>
                    <div className="font-bold text-2xl">{event?.date.toLocaleString('default', { day: 'numeric' }) || "..."}</div>
                </div>

                <div>
                    <div>{event && <>{numPlayers} players</>}</div>
                    <div>{event && <>{event?.matches.length} matches</>}</div>
                </div>

                {event && <h4 className="text-bold text-2xl">{event.title}</h4>}
            </div>

            {clicked &&
                <table className="m-auto">
                    <tbody>
                        {event?.matches.map((match) =>
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

type NewEventForm = {
    title: string,
    date: string,
}

const NewEvent: React.FC = () => {
    const utils = trpc.useContext();

    const { register, handleSubmit, reset } = useForm<NewEventForm>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
        },
    });

    const mutation = trpc.events.create.useMutation({
        onSuccess: () => {
            utils.events.invalidate();
        },
        onError: (err) => {
            console.error(err.message);
        },
    });

    const createNewEvent = (data: NewEventForm) => {
        mutation.mutate({
            ...data,
            date: new Date(data.date),
        });
        reset();
    };

    return (
        <form className="flex" onSubmit={handleSubmit(createNewEvent)}>
            <input
                className="border border-gray-300 p-2"
                type="text"
                placeholder="title"
                {...register("title")}
            />
            <input
                className="border border-gray-300 p-2"
                type="date"
                placeholder="Date"
                required
                {...register("date")}
            />
            <AddButton type="submit" />
        </form>
    );
};