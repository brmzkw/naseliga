import React from "react";

import { countries } from "react-circle-flags";
import { useForm } from "react-hook-form";

import type { PlayerFormSchema } from "./controller";
import { AddButton } from "../buttons";

type PlayerViewProps = {
    form: ReturnType<typeof useForm<PlayerFormSchema>>;
    onSubmit: (data: PlayerFormSchema) => Promise<void>;
    isLoading: boolean;
};

const PlayerView: React.FC<PlayerViewProps> = ({ form, onSubmit, isLoading }) => {
    const { register, handleSubmit } = form;
    return (
        <div>
            <form className="flex" onSubmit={handleSubmit(onSubmit)}>
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

export default PlayerView;