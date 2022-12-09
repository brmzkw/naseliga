import React from "react";

import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import { Caveat } from '@next/font/google'

import BaseLayout from "../layouts/base";
import { countries, CircleFlag } from "react-circle-flags";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { leaderboardRouter } from "../server/trpc/router/leaderboard";
import { useForm } from "react-hook-form";
import { playersRouter } from "../server/trpc/router/players";
import { AddButton, EditButton, RemoveButton, SubmitButton } from "../components/buttons";

const font = Caveat()

const AdminPage: NextPage = () => {
    return (
        <BaseLayout>
            <div className="m-3">
                <PlayersAdmin />
            </div>
        </BaseLayout>
    );
}

export default AdminPage;

const PlayersAdmin = () => {
    const playersQuery = trpc.players.list.useQuery();

    return (
        <div>
            <h2 className="font-bold mb-2">List of players</h2>

            <div className="flex flex-col gap-2">
                {playersQuery.data?.map((player) =>
                    <PlayersListRow key={player.id} player={player} />
                )}
            </div>

            <h2 className="font-bold mt-2 mb-2">Add a new player</h2>
            {playersQuery.data && <NewPlayer />}
        </div>
    );
};

type PlayersListRowProps = {
    player: inferRouterOutputs<typeof playersRouter>['list'][number]
};

const PlayersListRow: React.FC<PlayersListRowProps> = ({ player }) => {
    const [edit, setEdit] = React.useState(false);

    const { register, handleSubmit } = useForm<Omit<inferRouterInputs<typeof playersRouter>['edit'], "id">>({
        defaultValues: {
            country: player.country.toLocaleLowerCase(),
            name: player.name,
        },
    });

    const utils = trpc.useContext();

    const removePlayerMutation = trpc.players.delete.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
        },
        onError: (err) => {
            console.error(err.message);
        },
    });

    const editPlayerMutation = trpc.players.edit.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
            setEdit(false);
        },
        onError: (err) => {
            console.error(err.message);
        },
    });

    const removePlayer = () => {
        if (confirm(`Are you sure you want to remove ${player.name}?`)) {
            removePlayerMutation.mutate(player);
        }
    };

    const editPlayer = ((data: Omit<inferRouterInputs<typeof playersRouter>['edit'], "id">) => {
        editPlayerMutation.mutate({ id: player.id, ...data });
    });

    return (
        <form onSubmit={handleSubmit(editPlayer)} className="flex gap-3 items-center pb-2 border-b">
            <div>
                {
                    edit
                        ?
                        <select className="border border-gray-300 p-2 overflow-hidden w-20" {...register("country")}>
                            {
                                Object.keys(countries).map((country) => (
                                    <option key={country} value={country}>{country.toLocaleUpperCase()}</option>
                                ))
                            }
                        </select >
                        :
                        <div className="w-5">
                            {player.country && <CircleFlag countryCode={player.country.toLowerCase()} />}
                        </div>
                }
            </div >

            <div className="flex-1">
                {
                    edit ?
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
            </div>

            <div className="flex gap-1">
                {edit && <SubmitButton />}
                {edit ||
                    <>
                        <EditButton onClick={() => setEdit(true)} />
                        <RemoveButton onClick={removePlayer} />
                    </>
                }
            </div>
        </form>
    );
};


const NewPlayer: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<inferRouterInputs<typeof playersRouter>['create']>();

    const utils = trpc.useContext();
    const mutation = trpc.players.create.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
            reset();
        },
        onError: (err) => {
            console.error('Error while creating player', err);
        },

    });

    const onSubmit = ((data: inferRouterInputs<typeof playersRouter>['create']) => {
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

                <AddButton type="submit" />
            </form >
        </div>
    );
};