import React from 'react';
import Select, { Props } from 'react-select';

import { trpc } from '../utils/trpc';


const PlayerSelectInput = React.forwardRef<any, Props>((props, ref) => {
    const query = trpc.players.list.useQuery();

    const options = query.data?.map((player) => ({
        value: player.id,
        label: player.name,
    }));

    return (
        <Select ref={ref} options={options} noOptionsMessage={() => "Loading..."}
            {...props} />
    );
});

PlayerSelectInput.displayName = "PlayerSelectInput";

export default PlayerSelectInput;