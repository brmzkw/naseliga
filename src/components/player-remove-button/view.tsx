import { RemoveButton } from "../buttons";

type PlayerRemoveViewProps = {
    isLoading: boolean;
    onClick: () => void;
};

const PlayerRemoveView: React.FC<PlayerRemoveViewProps> = ({ onClick, isLoading }) => {
    return (
        <RemoveButton disabled={isLoading} onClick={onClick} />
    );
};

export default PlayerRemoveView;