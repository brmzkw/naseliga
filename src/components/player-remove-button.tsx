import toast from "react-hot-toast";

import type {
  PlayersRouterInput,
  PlayersRouterOutput,
} from "../server/trpc/router/players";
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
    },
  });

  return (
    <PlayerRemoveButtonView
      onClick={() => mutation.mutateAsync(player)}
      isLoading={mutation.isLoading}
    />
  );
};

export default PlayerRemoveButton;

type PlayerRemoveButtonViewProps = {
  isLoading: boolean;
  onClick: () => Promise<PlayersRouterOutput["delete"]>;
};

const PlayerRemoveButtonView: React.FC<PlayerRemoveButtonViewProps> = ({
  onClick,
  isLoading,
}) => {
  const doClick = () =>
    onClick()
      .then(() => toast.success("Yeah! Player removed"))
      .catch((err) => toast.error(err.message));

  return <RemoveButton disabled={isLoading} onClick={doClick} />;
};
