import React from 'react';

import Select, { type Props, type GroupBase, createFilter } from 'react-select';
import type { PlayersRouterOutput } from '../server/trpc/router/players';

import { trpc } from '../utils/trpc';
import PlayerName from './player-name';

type Player = PlayersRouterOutput["list"][number];

/*
* This component is a wrapper around react-select that fetches the list of players.
*/
const PlayerSelectInput = React.forwardRef((
    props: Props<Player, false, GroupBase<Player>>,
    ref: React.ComponentPropsWithRef<typeof Select<Player, false, GroupBase<Player>>>["ref"]
) => {

    const query = trpc.players.list.useQuery();

    return (
        <Select
            ref={ref}
            options={query.data}
            formatOptionLabel={(player) =>
                <PlayerName player={player} />
            }
            getOptionValue={(player) => player.id.toString()}
            filterOption={
                createFilter({
                    stringify: (option) => option.data.name,
                })
            }
            {...props}
        />
    );

});

PlayerSelectInput.displayName = 'PlayerSelectInput';

export default PlayerSelectInput;