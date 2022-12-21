import React from "react";

import { trpc } from "../../utils/trpc";
import PlayerController from "./controller";

const PlayerCreateForm: React.FC = () => {
    const utils = trpc.useContext();

    const mutation = trpc.players.create.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
        },
    });

    return <PlayerController onSubmit={mutation.mutateAsync} {...mutation} />;
};

export default PlayerCreateForm;