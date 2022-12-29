import { CircleFlag } from "react-circle-flags";

import type { PlayersRouterOutput } from "../server/trpc/router/players";

type PlayerNameProps = {
  player: PlayersRouterOutput["list"][number] | null;
};

export const PlayerName: React.FC<PlayerNameProps> = ({ player }) => {
  if (!player) {
    return null;
  }
  return (
    <div className="flex items-center">
      <div className="w-5">
        {player.country && (
          <CircleFlag countryCode={player.country.toLowerCase()} />
        )}
      </div>
      <span className="ml-2 capitalize">{player.name}</span>
    </div>
  );
};
