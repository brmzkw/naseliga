import toast from "react-hot-toast";

import { UpdateButton } from "./buttons";
import { trpc } from "../utils/trpc";

export const LeaderboardUpdateButton: React.FC = () => {
  const utils = trpc.useContext();
  const mutation = trpc.leaderboard.update.useMutation({
    onSuccess: () => {
      utils.leaderboard.invalidate();
      utils.events.invalidate();
    },
  });
  return (
    <LeaderboardUpdateButtonView
      isLoading={mutation.isLoading}
      onClick={mutation.mutateAsync}
    />
  );
};

type LeaderboardUpdateButtonViewProps = {
  isLoading: boolean;
  onClick: () => Promise<void>;
};

const LeaderboardUpdateButtonView: React.FC<
  LeaderboardUpdateButtonViewProps
> = ({ isLoading, onClick }) => {
  const doClick = () => {
    onClick()
      .then(() => toast.success("Hoora! Leaderboard updated :))"))
      .catch(() =>
        toast.error(
          "Oops... Something went wrong. Try to update again a few times. If the error persists, please contact Julien."
        )
      );
  };

  return (
    <UpdateButton
      disabled={isLoading}
      text="Update leaderboard"
      onClick={doClick}
    />
  );
};
