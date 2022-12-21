import React from "react";
import { PlayersRouterOutput } from "../../server/trpc/router/players";

import { trpc } from "../../utils/trpc";
import PlayerController from "./controller";

export type PlayerCreateOutput = PlayersRouterOutput["create"];

const PlayerForm: React.FC = () => {
    const utils = trpc.useContext();

    const mutation = trpc.players.create.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
        },
    });

    return <PlayerController onSubmit={mutation.mutateAsync} isLoading={mutation.isLoading} />;
};

export default PlayerForm;