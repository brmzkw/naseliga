import React from "react";

import { type NextPage } from "next";

import toast from 'react-hot-toast';
import { countries } from "react-circle-flags";
import { useForm } from "react-hook-form";

import { trpc } from "../utils/trpc";

import BaseLayout from "../layouts/base";
import type { PlayersRouterInput, PlayersRouterOutput } from "../server/trpc/router/players";
import { EditButton, RemoveButton, SubmitButton } from "../components/buttons";
import PlayerName from "../components/player-name";
import LoadingSpinner from "../components/loading-spinner";
import PlayerForm from "../components/player-form";

type PlayerForm = PlayersRouterInput["create"];

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

    if (!playersQuery.data) {
        return <LoadingSpinner text="Loading players..." />;
    }

    return (
        <div>
            <h2 className="font-bold mb-2">List of players</h2>

            <div className="flex flex-col gap-2">
                {playersQuery.data.map((player) =>
                    <PlayersListRow key={player.id} player={player} />
                )}
            </div>

            <h2 className="font-bold mt-2 mb-2">Add a new player</h2>
            <PlayerForm />
        </div>
    );
};

type PlayersListRowProps = {
    player: PlayersRouterOutput['list'][number]
};

const PlayersListRow: React.FC<PlayersListRowProps> = ({ player }) => {
    const [edit, setEdit] = React.useState(false);

    const { register, handleSubmit } = useForm<PlayerForm>({
        defaultValues: {
            country: player.country.toLocaleLowerCase(),
            name: player.name,
        },
    });

    const utils = trpc.useContext();

    const removePlayerMutation = trpc.players.delete.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
            toast.success("Yeah! Player removed");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    const editPlayerMutation = trpc.players.edit.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
            setEdit(false);
            toast.success("Yeah! Player updated");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const removePlayer = () => {
        removePlayerMutation.mutate(player);
    };

    const editPlayer = ((data: PlayerForm) => {
        editPlayerMutation.mutate({ id: player.id, ...data });
    });

    return (
        <form onSubmit={handleSubmit(editPlayer)} className="flex gap-1 pb-1 border-b">
            <div className="flex-1 flex gap-1">
                {
                    edit ? (
                        <>
                            <select className="border border-gray-300 p-2 overflow-hidden w-20" {...register("country")}>
                                {
                                    Object.keys(countries).map((country) => (
                                        <option key={country} value={country}>{country.toLocaleUpperCase()}</option>
                                    ))
                                }
                            </select >
                            <input
                                className="border border-gray-300 p-2"
                                type="text"
                                placeholder="Name"
                                {...register("name")}
                                required
                            />
                        </>
                    ) : (
                        <PlayerName player={player} />
                    )
                }
            </div>

            <div className="flex gap-1">
                {edit && <SubmitButton disabled={editPlayerMutation.isLoading} />}
                {edit ||
                    <>
                        <EditButton onClick={() => setEdit(true)} />
                        <RemoveButton disabled={removePlayerMutation.isLoading} onClick={removePlayer} />
                    </>
                }
            </div>
        </form>
    );
};