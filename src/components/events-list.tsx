import React from 'react';

import { useSession } from 'next-auth/react';
import type { inferRouterOutputs } from '@trpc/server';
import { useForm, Controller } from 'react-hook-form';

import type { eventsRouter, EventsRouterOutput, EventsRouterInput } from '../server/trpc/router/events';
import { AddButton, RemoveButton } from './buttons';
import { trpc } from '../utils/trpc';
import PlayerSelect from './player-select';
import PlayerName from './player-name';

type EventsListProps = {
    events?: inferRouterOutputs<typeof eventsRouter>['list']
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
    const { data: sessionData } = useSession();
    const defaultData = Array.from(Array(10).keys()).map(() => null);

    return (
        <div className="flex flex-col gap-3 pl-2">
            {sessionData?.user?.isAdmin && (
                <>
                    <h2 className="font-bold text-xl">Create a new event</h2>
                    <NewEvent />
                </>
            )}

            <h2 className="font-bold text-xl">Last events</h2>
            <ul>
                {(events || defaultData).map((event, idx) =>
                    <li key={event?.id || idx} className="[&:not(:first-child)]:mt-4">
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
    const { data: sessionData } = useSession();

    const [clicked, setClicked] = React.useState(defaultOpen);

    const numPlayers = [...new Set(
        event?.matches.map((match) => [match.playerAId, match.playerBId]).flat()
    )].length;
    return (
        <>
            <div
                className={`flex gap-5 p-3 items-center border-l-4  border-l-purple-700 cursor-pointer hover:bg-purple-500 hover:text-white ${event || 'animate-pulse'}`}
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

            {clicked && event &&
                <>
                    {sessionData?.user?.isAdmin && <div className="mt-3">
                        <DeleteEvent event={event} />
                    </div>
                    }
                    <MatchList event={event} />
                </>
            }
        </>
    );
};

// Same as EventsRouterInput["create"] but without id, and date as string
type NewEventForm = Omit<Omit<EventsRouterInput["create"], "id">, "date"> & {
    date: string,
};

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
        <form className="flex gap-2" onSubmit={handleSubmit(createNewEvent)}>
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

type DeleteEventProps = {
    event: EventsRouterOutput["list"][number],
};

type DeleteEventForm = EventsRouterInput["delete"];

const DeleteEvent: React.FC<DeleteEventProps> = ({ event }) => {
    const utils = trpc.useContext();
    const { register, handleSubmit } = useForm<DeleteEventForm>({
        defaultValues: {
            id: event?.id,
        }
    });

    const mutation = trpc.events.delete.useMutation({
        onSuccess: () => {
            utils.events.invalidate();
        },
        onError: (err) => {
            console.error(err.message);
        },
    });

    const removeEvent = (data: DeleteEventForm) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(removeEvent)}>
            <input type="hidden" {...register("id")} />
            <RemoveButton type="submit" />
        </form>
    )
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
                        <tr key={match.id} className={`border-b border-purple-700`}>
                            <td className={`flex items-center p-3 ${match.scoreA > match.scoreB ? 'font-bold' : ''}`}>
                                <PlayerName player={match.playerB} />
                            </td>
                            <td className={`p-3 ${match.scoreA > match.scoreB ? 'font-bold' : ''}`}>{match.scoreA}</td>

                            <td className={`flex items-center p-3 ${match.scoreB > match.scoreA ? 'font-bold' : ''}`}>
                                <PlayerName player={match.playerB} />
                            </td>
                            <td className={`p-3 ${match.scoreB > match.scoreA ? 'font-bold' : ''}`}>{match.scoreB}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {sessionData?.user?.isAdmin &&
                <div className="mt-4">
                    <NewMatch event={event} />
                </div>
            }
        </div>
    );
};

type NewMatchProps = MatchListProps;

type NewMatchForm = {
    scoreA: string;
    scoreB: string;
    playerA: {
        id: number;
        name: string;
        country: string;
    },
    playerB: {
        id: number;
        name: string;
        country: string;
    },
};

const NewMatch: React.FC<NewMatchProps> = ({ event }) => {
    const { control, register, handleSubmit } = useForm<NewMatchForm>({
        defaultValues: {
            scoreA: "0",
            scoreB: "0",
        }
    });

    const utils = trpc.useContext();

    const mutation = trpc.events.createMatch.useMutation({
        onSuccess: () => {
            utils.events.invalidate();
        },
        onError: (err) => {
            console.error('Error while creating match', err);
        },
    });

    const onSubmit = (data: NewMatchForm) => {
        mutation.mutate({
            eventId: event.id,
            playerAId: data.playerA.id,
            scoreA: parseInt(data.scoreA, 10),
            playerBId: data.playerB.id,
            scoreB: parseInt(data.scoreB, 10),
        });
    };

    return (
        <>
            <hr />
            <h4 className="text-xl text-center text-bold">Add a new match</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="flex justify-around pt-4 pb-4">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div>
                        <Controller
                            name="playerA"
                            control={control}
                            render={
                                ({ field }) =>
                                    <PlayerSelect
                                        {...field}
                                        placeholder="First player"
                                        required
                                    />
                            }
                        />
                    </div>
                    <div>
                        <input
                            className="border border-gray-300 p-2 w-full"
                            type="number"
                            min="0"
                            placeholder="First score"
                            required
                            {...register("scoreA")}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <AddButton type="submit" />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div>
                        <Controller
                            name="playerB"
                            control={control}
                            render={
                                ({ field }) =>
                                    <PlayerSelect
                                        {...field}
                                        placeholder="Second player"
                                        required
                                    />
                            }
                        />
                    </div>
                    <div>
                        <input
                            className="border border-gray-300 p-2 w-full"
                            type="number"
                            min="0"
                            placeholder="Second score"
                            required
                            {...register("scoreB")}
                        />
                    </div>
                </div>
            </form>
            <hr />
        </>
    );
};