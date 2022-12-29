import React from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { trpc } from "../utils/trpc";
import type {
  PlayersRouterInput,
  PlayersRouterOutput,
} from "../server/trpc/router/players";
import { AddButton } from "./buttons";
import { CountrySelect } from "./country-select";

export type PlayerFormSchema = PlayersRouterInput["create"];

export const PlayerCreateForm: React.FC = () => {
  const form = useForm<PlayerFormSchema>();
  const utils = trpc.useContext();

  const mutation = trpc.players.create.useMutation({
    onSuccess: () => {
      utils.players.invalidate();
      form.reset();
    },
  });

  return (
    <PlayerCreateView
      form={form}
      createPlayer={mutation.mutateAsync}
      isLoading={mutation.isLoading}
    />
  );
};

type PlayerViewProps = {
  form: ReturnType<typeof useForm<PlayerFormSchema>>;
  createPlayer: (
    data: PlayerFormSchema
  ) => Promise<PlayersRouterOutput["create"]>;
  isLoading: boolean;
};

const PlayerCreateView: React.FC<PlayerViewProps> = ({
  form,
  createPlayer,
  isLoading,
}) => {
  const { register, handleSubmit } = form;

  const doSubmit = handleSubmit((data) =>
    createPlayer(data)
      .then(() => toast.success("Yeah! Player created"))
      .catch((err) => toast.error(err.message))
  );

  return (
    <div>
      <form className="flex" onSubmit={doSubmit}>
        <CountrySelect {...register("country")} />
        <input
          className="border border-gray-300 p-2"
          type="text"
          placeholder="Name"
          {...register("name")}
          required
        />

        <AddButton disabled={isLoading} type="submit" />
      </form>
    </div>
  );
};
