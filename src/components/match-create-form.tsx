import React from 'react';

import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import type { EventsRouterOutput } from '../server/trpc/router/events';
import { AddButton } from './buttons';
import { trpc } from '../utils/trpc';
import PlayerSelect from './player-select';

type MatchCreateForm = {
    scoreA: string;
    scoreB: string;
    playerA: {
        id: number;
        name: string;
        country: string;
    },
    playerB: {
        id: number;
        name: string;
        country: string;
    },
};

type MatchCreateFormProps = {
    event: EventsRouterOutput["list"][number];
};

const MatchCreateForm: React.FC<MatchCreateFormProps> = ({ event }) => {
    const form = useForm<MatchCreateForm>({
        defaultValues: {
            scoreA: "0",
            scoreB: "0",
        }
    });

    const utils = trpc.useContext();

    const mutation = trpc.events.createMatch.useMutation({
        onSuccess: () => {
            utils.events.invalidate();
        },
    });

    return (
        <MatchCreateFormView
            form={form}
            createMatch={(data) => {
                return mutation.mutateAsync({
                    eventId: event.id,
                    playerAId: data.playerA.id,
                    scoreA: parseInt(data.scoreA, 10),
                    playerBId: data.playerB.id,
                    scoreB: parseInt(data.scoreB, 10),
                })
            }}
            isLoading={mutation.isLoading}
        />
    );
};

export default MatchCreateForm;

type MatchCreateFormViewProps = {
    form: ReturnType<typeof useForm<MatchCreateForm>>;
    createMatch: (data: MatchCreateForm) => Promise<EventsRouterOutput["createMatch"]>;
    isLoading: boolean;
};

const MatchCreateFormView: React.FC<MatchCreateFormViewProps> = ({ form, createMatch, isLoading }) => {
    const { control, register, handleSubmit } = form;

    const doSubmit = handleSubmit((data) =>
        createMatch(data)
            .then(() => toast.success("Match created 🎉"))
            .catch((err) => toast.error(err.message))
    );

    return (
        <form onSubmit={doSubmit} className="flex justify-around pt-4 pb-4">
            <div className="flex flex-col items-center justify-center gap-4">
                <div>
                    <Controller
                        name="playerA"
                        control={control}
                        render={
                            ({ field }) =>
                                <PlayerSelect
                                    {...field}
                                    placeholder="First player"
                                    required
                                />
                        }
                    />
                </div>
                <div>
                    <input
                        className="border border-gray-300 p-2 w-full"
                        type="number"
                        min="0"
                        placeholder="First score"
                        required
                        {...register("scoreA")}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <AddButton disabled={isLoading} type="submit" />
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <div>
                    <Controller
                        name="playerB"
                        control={control}
                        render={
                            ({ field }) =>
                                <PlayerSelect
                                    {...field}
                                    placeholder="Second player"
                                    required
                                />
                        }
                    />
                </div>
                <div>
                    <input
                        className="border border-gray-300 p-2 w-full"
                        type="number"
                        min="0"
                        placeholder="Second score"
                        required
                        {...register("scoreB")}
                    />
                </div>
            </div>
        </form>
    );
};