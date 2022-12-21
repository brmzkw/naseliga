import { TRPCClientError } from '@trpc/client';
import toast from 'react-hot-toast';
import type { PlayersRouterInput, PlayersRouterOutput } from '../../server/trpc/router/players';

import PlayerRemoveView from "./view";

type PlayerRemoveControllerProps = {
    player: PlayersRouterInput["delete"];
    onSubmit: (player: PlayersRouterInput["delete"]) => Promise<PlayersRouterOutput["delete"]>;
} & Omit<React.ComponentProps<typeof PlayerRemoveView>, "onClick">;

const PlayerRemoveController: React.FC<PlayerRemoveControllerProps> = ({ onSubmit, player, ...props }) => {
    const onClick = async () => {
        try {
            await onSubmit(player);
            toast.success("Yeah! Player removed");
        } catch (err) {
            if (err instanceof TRPCClientError) {
                toast.error(err.message);
            }
        }
    };
    return <PlayerRemoveView {...props} onClick={onClick} />;
};

export default PlayerRemoveController;