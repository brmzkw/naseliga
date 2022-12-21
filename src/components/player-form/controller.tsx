import React from "react";

import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";

import type { PlayersRouterInput } from "../../server/trpc/router/players";
import type { PlayerCreateOutput } from ".";
import PlayerView from "./view";
import { TRPCClientError } from "@trpc/client";

export type PlayerFormSchema = PlayersRouterInput["create"];

type NewPlayerControllerProps = {
    onSubmit: (data: PlayerFormSchema) => Promise<PlayerCreateOutput>;
    isLoading: boolean;
};

const NewPlayerController: React.FC<NewPlayerControllerProps> = ({ onSubmit, isLoading }) => {
    const form = useForm<PlayerFormSchema>();

    return (
        <PlayerView
            form={form}
            onSubmit={
                async (data) => {
                    try {
                        const ret = await onSubmit(data);
                        form.reset();
                        toast.success("Yeah! Player created");
                    } catch (err) {
                        if (err instanceof TRPCClientError) {
                            toast.error(err.message);
                        }
                    }
                }
            }
            isLoading={isLoading} />
    );
};

export default NewPlayerController;