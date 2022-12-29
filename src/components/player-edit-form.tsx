import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import type {
  PlayersRouterInput,
  PlayersRouterOutput,
} from "../server/trpc/router/players";
import { SubmitButton } from "./buttons";
import { trpc } from "../utils/trpc";
import CountrySelect from "./country-select";

type PlayerForm = Omit<PlayersRouterInput["edit"], "id">;

type PlayerEditFormProps = {
  player: PlayersRouterOutput["list"][number];
  onFinished: (player: PlayersRouterOutput["edit"]) => void;
};

const PlayerEditForm: React.FC<PlayerEditFormProps> = ({
  player,
  onFinished,
}) => {
  const utils = trpc.useContext();
  const form = useForm<PlayerForm>({
    defaultValues: {
      country: player.country.toLocaleLowerCase(),
      name: player.name,
    },
  });

  const editPlayerMutation = trpc.players.edit.useMutation({
    onSuccess: (player) => {
      utils.players.invalidate();
      onFinished(player);
    },
  });

  return (
    <PlayerEditFormView
      form={form}
      editPlayer={async (data: PlayerForm) =>
        editPlayerMutation.mutateAsync({
          id: player.id,
          ...data,
        })
      }
      isLoading={editPlayerMutation.isLoading}
    />
  );
};

export default PlayerEditForm;

type PlayerEditFormViewProps = {
  form: ReturnType<typeof useForm<PlayerForm>>;
  editPlayer: (data: PlayerForm) => Promise<PlayersRouterOutput["edit"]>;
  isLoading: boolean;
};

const PlayerEditFormView: React.FC<PlayerEditFormViewProps> = ({
  form,
  editPlayer,
  isLoading,
}) => {
  const { register, handleSubmit } = form;

  const doSubmit = handleSubmit((data) =>
    editPlayer(data)
      .then(() => toast.success("Yeah! Player updated"))
      .catch((err) => toast.error(err.message))
  );

  return (
    <form onSubmit={doSubmit} className="flex gap-1">
      <CountrySelect {...register("country")} />
      <input
        className="border border-gray-300 p-2"
        type="text"
        placeholder="Name"
        {...register("name")}
        required
      />
      <SubmitButton type="submit" disabled={isLoading} />
    </form>
  );
};
