import React from "react";

import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { countries } from "react-circle-flags";

import { trpc } from "../utils/trpc";
import type { PlayersRouterInput, PlayersRouterOutput } from "../server/trpc/router/players";
import { AddButton } from "./buttons";

export type PlayerFormSchema = PlayersRouterInput["create"];

const PlayerCreateForm: React.FC = () => {
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
            onSubmit={mutation.mutateAsync}
            isLoading={mutation.isLoading}
        />
    );
};

export default PlayerCreateForm;

type PlayerViewProps = {
    form: ReturnType<typeof useForm<PlayerFormSchema>>;
    onSubmit: (data: PlayerFormSchema) => Promise<PlayersRouterOutput["create"]>;
    isLoading: boolean;
};

const PlayerCreateView: React.FC<PlayerViewProps> = ({ form, onSubmit, isLoading }) => {
    const { register, handleSubmit } = form;

    return (
        <div>
            <form className="flex" onSubmit={handleSubmit((data) =>
                onSubmit(data).then(() => {
                    toast.success("Yeah! Player created");
                }).catch((err) => {
                    toast.error(err.message);
                })
            )}>
                <select className="border border-gray-300 p-2 overflow-hidden w-20" {...register("country")}>
                    {Object.keys(countries).map((country) => (
                        <option key={country} value={country}>{country.toLocaleUpperCase()}</option>
                    ))}
                </select>

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