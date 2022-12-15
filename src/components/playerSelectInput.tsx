import React from 'react';

import { CircleFlag } from "react-circle-flags";
import Select, { Props } from 'react-select';

import { trpc } from '../utils/trpc';


const PlayerSelectInput = React.forwardRef<any, Props>(({ ...props }, ref) => {
    const query = trpc.players.list.useQuery();
    type PlayerType = NonNullable<typeof query.data>[number];

    const formatOptionLabel = ({ name, country }: PlayerType) => {
        return (
            <div className="flex items-center">
                <div className="w-5">
                    {country && <CircleFlag countryCode={country.toLowerCase()} />}
                </div>
                <div className="ml-2 capitalize">
                    {name}
                </div>
            </div>
        );
    };

    return (
        <Select
            ref={ref}
            options={query.data}
            formatOptionLabel={formatOptionLabel as any}
            getOptionValue={(player) => (player as PlayerType).id.toString()}
            {...props}
        />
    );
});

export default PlayerSelectInput;