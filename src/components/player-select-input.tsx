import React from 'react';

import { CircleFlag } from "react-circle-flags";
import Select, { type Props, type GroupBase } from 'react-select';
import type { PlayersRouterOutput } from '../server/trpc/router/players';

import { trpc } from '../utils/trpc';

type Player = PlayersRouterOutput["list"][number];

/*
* This component is a wrapper around react-select that fetches the list of players.
*/
const PlayerSelectInput = React.forwardRef((
    props: Props<Player, false, GroupBase<Player>>,
    ref: React.ComponentPropsWithRef<typeof Select<Player, false, GroupBase<Player>>>["ref"]
) => {

    const query = trpc.players.list.useQuery();

    const formatOptionLabel = ({ name, country }: Player) => {
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
    }

    return (
        <Select
            ref={ref}
            options={query.data}
            formatOptionLabel={formatOptionLabel}
            getOptionValue={(player) => player.id.toString()}
            {...props}
        />
    );

});

PlayerSelectInput.displayName = 'PlayerSelectInput';

export default PlayerSelectInput;