import React from "react";

import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import { Caveat } from '@next/font/google'

import BaseLayout from "../layouts/base";
import { countries, CircleFlag } from "react-circle-flags";
import { inferRouterOutputs } from "@trpc/server";
import { leaderboardRouter } from "../server/trpc/router/leaderboard";
import { useForm } from "react-hook-form";
import { playersRouter } from "../server/trpc/router/players";


const font = Caveat()

const AdminPage: NextPage = () => {
    return (
        <BaseLayout>
            <div className="m-3">
                <PlayersList />
            </div>
        </BaseLayout>
    );
}

export default AdminPage;

const PlayersList = () => {
    const playersQuery = trpc.players.list.useQuery();

    return (
        <div>
            <h2 className="font-bold mb-2">List of players</h2>

            <table>
                <tbody>
                    {playersQuery.data?.map((player) =>
                        <PlayersListRow key={player.id} player={player} />
                    )}
                </tbody>
            </table>

            <h2 className="font-bold mt-2 mb-2">Add a new player</h2>
            {playersQuery.data && <NewPlayer />}
        </div >
    );
};

type PlayerFormValues = {
    country: string;
    name: string;
};


type PlayersListRowProps = {
    player: inferRouterOutputs<typeof playersRouter>['list'][number]
};

const PlayersListRow: React.FC<PlayersListRowProps> = ({ player }) => {
    const [edit, setEdit] = React.useState(false);

    const { register, handleSubmit } = useForm<PlayerFormValues>({
        defaultValues: {
            country: player.country.toLocaleLowerCase(),
            name: player.name,
        },
    });

    const utils = trpc.useContext();

    const removeMutation = trpc.players.delete.useMutation({
        onSuccess: () => {
            utils.players.list.invalidate();
        },
        onError: (err) => {
            console.error(err.message);
        },
    });

    const editMutation = trpc.players.edit.useMutation({
        onSuccess: () => {
            utils.players.list.invalidate();
            setEdit(false);
        },
        onError: (err) => {
            console.error(err.message);
        },
    });

    const removePlayer = () => {
        if (confirm(`Are you sure you want to remove ${player.name}?`)) {
            removeMutation.mutate(player);
        }
    };

    const handleEditSubmit = ((data: PlayerFormValues) => {
        editMutation.mutate({ id: player.id, ...data });
    });

    return (
        <tr>
            <td className="border-b">
                {edit
                    ?
                    <select className="border border-gray-300 p-2 overflow-hidden w-20" {...register("country")}>
                        {Object.keys(countries).map((country) => (
                            <option key={country} value={country}>{country.toLocaleUpperCase()}</option>
                        ))}
                    </select>
                    :
                    <div className="w-5">
                        {player.country && <CircleFlag countryCode={player.country.toLowerCase()} />}
                    </div>
                }
            </td>
            <td className="border-b">
                {edit ?
                    <input
                        className="border border-gray-300 p-2"
                        type="text"
                        placeholder="Name"
                        {...register("name")}
                        required
                    />
                    :
                    <span className="capitalize">{player.name}</span>
                }
            </td>

            <td className="border-b">
                <div className="flex">
                    {edit ?
                        <form onSubmit={handleSubmit(handleEditSubmit)}>
                            <button className="bg-green-600 rounded-md text-white text-center flex m-1 items-center p-1 pr-2" type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                <div>Submit</div>
                            </button>
                        </form>
                        : (
                            <>
                                <button className="bg-slate-700 rounded-md text-white flex m-1 items-center p-1 pr-2" onClick={() => setEdit(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                    <div>Edit</div>
                                </button>
                                <button className="bg-red-700 rounded-md text-white text-center flex m-1 items-center p-1 pr-2" onClick={removePlayer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    <div>Delete</div>
                                </button>
                            </>
                        )
                    }
                </div>
            </td>
        </tr >
    );
};

const NewPlayer: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<PlayerFormValues>();

    const utils = trpc.useContext();
    const mutation = trpc.players.create.useMutation({
        onSuccess: () => {
            utils.players.list.invalidate();
            reset();
        },
        onError: (err) => {
            console.error('Error while creating player', err);
        },

    });

    const onSubmit = ((data: PlayerFormValues) => {
        mutation.mutate(data);
    });

    return (
        <div>
            <form className="flex" onSubmit={handleSubmit(onSubmit)}>
                <select className="border border-gray-300 p-2 overflow-hidden w-20" {...register("country")}>
                    {Object.keys(countries).map((country) => (
                        <option key={country} value={country}>{country.toLocaleUpperCase()}</option>
                    ))}
                </select>

                <input
                    className="border border-gray-300 p-2"
                    type="text"
                    placeholder="Name"
                    {...register("name")}
                    required
                />

                <button className="bg-green-800 rounded-md text-white flex m-1 items-center p-2" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>Add</div>
                </button>
            </form >
        </div>
    );
};