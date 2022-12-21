import type { PlayersRouterInput } from "../../server/trpc/router/players";
import { trpc } from "../../utils/trpc";
import PlayerRemoveController from "./controller";


type PlayerRemoveButtonProps = {
    player: PlayersRouterInput["delete"];
};

const PlayerRemoveButton: React.FC<PlayerRemoveButtonProps> = ({ player }) => {
    const utils = trpc.useContext();

    const mutation = trpc.players.delete.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
        },
    });

    return <PlayerRemoveController player={player} onSubmit={mutation.mutateAsync} {...mutation} />;
};


export default PlayerRemoveButton;