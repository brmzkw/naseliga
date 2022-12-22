import toast from 'react-hot-toast';

import { UpdateButton } from "./buttons";
import { trpc } from "../utils/trpc";

const LeaderboardUpdateButton: React.FC = () => {
    const utils = trpc.useContext();
    const mutation = trpc.leaderboard.update.useMutation({
        onSuccess: () => {
            utils.leaderboard.invalidate();
        },
    });
    return (
        <LeaderboardUpdateButtonView
            isLoading={mutation.isLoading}
            onClick={mutation.mutateAsync}
        />
    );
};

export default LeaderboardUpdateButton;

type LeaderboardUpdateButtonViewProps = {
    isLoading: boolean;
    onClick: () => Promise<void>;
};

const LeaderboardUpdateButtonView: React.FC<LeaderboardUpdateButtonViewProps> = ({ isLoading, onClick }) => {
    const doClick = () => {
        onClick()
            .then(() => toast.success("Hoora! Leaderboard updated :))"))
            .catch(() => toast.error("Something went wrong :("));
    };

    return (
        <UpdateButton
            disabled={isLoading}
            text="Update leaderboard"
            onClick={doClick}
        />
    );
};