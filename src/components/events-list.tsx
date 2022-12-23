import React from 'react';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import type { EventsRouterOutput, EventsRouterInput, eventsRouter } from '../server/trpc/router/events';
import { AddButton, RemoveButton } from './buttons';
import { trpc } from '../utils/trpc';
import PlayerName from './player-name';
import LoadingSpinner from './loading-spinner';
import type { inferRouterOutputs } from '@trpc/server';
import MatchCreateForm from './match-create-form';

const EventsList: React.FC = () => {
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
                    <NewEvent />
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

export default EventsList;

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

    const today = new Date();

    const { register, handleSubmit, reset } = useForm<NewEventForm>({
        defaultValues: {
            date: today.toISOString().split('T')[0],
            title: `${today.toLocaleString('default', { weekday: 'long' })} squash`,
        }
    });

    const mutation = trpc.events.create.useMutation({
        onSuccess: () => {
            utils.events.invalidate();
            toast.success("Event created ♥️");
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
                placeholder="Event title"
                {...register("title")}
            />
            <input
                className="border border-gray-300 p-2"
                type="date"
                placeholder="Date"
                required
                {...register("date")}
            />
            <AddButton disabled={mutation.isLoading} type="submit" />
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
            toast.success("Event deleted 😵‍💫");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    const removeEvent = (data: DeleteEventForm) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(removeEvent)}>
            <input type="hidden" {...register("id")} />
            <RemoveButton disabled={mutation.isLoading} type="submit" />
        </form>
    )
};

type MatchListProps = {
    event: EventsRouterOutput["list"][number],
};

const MatchList: React.FC<MatchListProps> = ({ event }) => {
    const { data: sessionData } = useSession();
    const utils = trpc.useContext();

    const mutation = trpc.events.deleteMatch.useMutation({
        onSuccess: () => {
            utils.events.invalidate();
            toast.success("Match deleted 💫");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

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
                                    <RemoveButton disabled={mutation.isLoading} onClick={() => mutation.mutate({ id: match.id })} />
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
