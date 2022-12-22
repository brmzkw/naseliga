import toast from 'react-hot-toast';

import type { PlayersRouterInput } from "../server/trpc/router/players";
import { trpc } from "../utils/trpc";
import { RemoveButton } from "./buttons";


type PlayerRemoveButtonProps = {
    player: PlayersRouterInput["delete"];
};

const PlayerRemoveButton: React.FC<PlayerRemoveButtonProps> = ({ player }) => {
    const utils = trpc.useContext();

    const mutation = trpc.players.delete.useMutation({
        onSuccess: () => {
            utils.players.invalidate();
            toast.success("Yeah! Player removed");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });
    return (
        <PlayerRemoveButtonView
            onClick={() => mutation.mutate(player)}
            isLoading={mutation.isLoading}
        />
    );
};

export default PlayerRemoveButton;

type PlayerRemoveButtonViewProps = {
    isLoading: boolean;
    onClick: () => void;
};

const PlayerRemoveButtonView: React.FC<PlayerRemoveButtonViewProps> = ({ onClick, isLoading }) => {
    return (
        <RemoveButton disabled={isLoading} onClick={onClick} />
    );
};