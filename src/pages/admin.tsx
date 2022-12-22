import React from "react";

import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

import BaseLayout from "../layouts/base";
import type { PlayersRouterOutput } from "../server/trpc/router/players";
import { EditButton } from "../components/buttons";
import PlayerName from "../components/player-name";
import LoadingSpinner from "../components/loading-spinner";
import PlayerCreateForm from "../components/player-create-form";
import PlayerRemoveButton from "../components/player-remove-button";
import PlayerEditForm from "../components/player-edit-form";

const AdminPage: NextPage = () => {
    const playersQuery = trpc.players.list.useQuery();

    if (!playersQuery.data) {
        return <LoadingSpinner text="Loading players..." />;
    }
    return (
        <BaseLayout>
            <div className="m-3">
                <div>
                    <h2 className="font-bold mb-2">List of players</h2>

                    <div className="flex flex-col gap-2">
                        {playersQuery.data.map((player) =>
                            <PlayersListRow key={player.id} player={player} />
                        )}
                    </div>

                    <h2 className="font-bold mt-2 mb-2">Add a new player</h2>
                    <PlayerCreateForm />
                </div>
            </div>
        </BaseLayout>
    );
}

export default AdminPage;

type PlayersListRowProps = {
    player: PlayersRouterOutput['list'][number]
};

const PlayersListRow: React.FC<PlayersListRowProps> = ({ player }) => {
    const [edit, setEdit] = React.useState(false);

    if (edit) {
        return (
            <PlayerEditForm player={player} onFinished={() => setEdit(false)} />
        );
    }
    return (
        <div className="flex gap-1 pb-1 border-b items-center">
            <div className="flex-1">
                <PlayerName player={player} />
            </div>
            <EditButton onClick={() => setEdit(true)} />
            <PlayerRemoveButton player={player} />
        </div>
    );
};