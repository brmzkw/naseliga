import React from "react";
import { CircleFlag } from "react-circle-flags";

import type { PlayersRouterOutput } from "../server/trpc/router/players";

import PlayerSelectInput from "./player-select-input";

type Player = PlayersRouterOutput["list"][number];

/*
* Display a big flag on top of the player select input.
*/
const PlayerSelect = React.forwardRef((
    props: React.ComponentPropsWithoutRef<typeof PlayerSelectInput>,
    ref: React.ComponentPropsWithRef<typeof PlayerSelectInput>["ref"]
) => {
    const [player, setPlayer] = React.useState<Player>();

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-24 h-24">
                <CircleFlag countryCode={player?.country.toLowerCase() || ""} />
            </div>
            <PlayerSelectInput
                ref={ref}
                className="w-full"
                {...props}
                onChange={(player, actionMeta) => {
                    if (player) {
                        setPlayer(player);
                    }
                    if (props.onChange) {
                        props.onChange(player, actionMeta);
                    }
                }}
            />
        </div>
    );
});

PlayerSelect.displayName = "PlayerSelect";

export default PlayerSelect;