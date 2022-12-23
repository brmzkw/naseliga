import React from "react";

import { trpc } from "../utils/trpc";

import type { PlayersRouterOutput } from "../server/trpc/router/players";
import { EditButton } from "./buttons";
import PlayerName from "./player-name";
import LoadingSpinner from "./loading-spinner";
import PlayerRemoveButton from "./player-remove-button";
import PlayerEditForm from "./player-edit-form";

const PlayerList: React.FC = () => {
    const playersQuery = trpc.players.list.useQuery();

    if (!playersQuery.data) {
        return <LoadingSpinner text="Loading players..." />;
    }
    return (
        <div className="flex flex-col gap-2">
            {playersQuery.data.map((player) =>
                <PlayerListRow key={player.id} player={player} />
            )}
        </div>
    );
}

export default PlayerList;

type PlayersListRowProps = {
    player: PlayersRouterOutput['list'][number]
};

const PlayerListRow: React.FC<PlayersListRowProps> = ({ player }) => {
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