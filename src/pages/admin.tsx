import React from "react";

import { type NextPage } from "next";

import { trpc } from "../utils/trpc";
import { Caveat } from '@next/font/google'

import BaseLayout from "../layouts/base";
import { countries, CircleFlag } from "react-circle-flags";
import { inferRouterOutputs } from "@trpc/server";
import { naseligaRouter } from "../server/trpc/router/naseliga";
import { useForm } from "react-hook-form";


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
    const playersQuery = trpc.naseliga.getPlayers.useQuery();

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

type PlayersListRowProps = {
    player: inferRouterOutputs<typeof naseligaRouter>['getPlayers'][number]
};

const PlayersListRow: React.FC<PlayersListRowProps> = ({ player }) => {
    return (
        <tr>
            <td className="border-b">
                <div className="w-5">
                    {player.country && <CircleFlag countryCode={player.country.toLowerCase()} />}
                </div>
            </td>
            <td className="border-b">
                <span className="capitalize">{player.name}</span>
            </td>

            <td className="border-b">
                {/* <button className="bg-slate-700 rounded-md text-white flex m-1 items-center p-1 pr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <div>Edit</div>
                </button> */}
                {/* <button className="bg-red-700 rounded-md text-white text-center flex m-1 items-center p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <div>Hide</div>
                </button> */}
            </td>
        </tr>
    );
};

type NewPlayerFormValues = {
    country: string;
    name: string;
};

const NewPlayer: React.FC = () => {
    const utils = trpc.useContext();
    const mutation = trpc.naseliga.addPlayer.useMutation({
        onSuccess: () => {
            utils.naseliga.getPlayers.invalidate();
        },
        onError: (err) => {
            console.log('Error while creating player', err);
        },

    });

    const { register, handleSubmit } = useForm<NewPlayerFormValues>();

    const onSubmit = ((data: NewPlayerFormValues) => {
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