import { type NextPage } from "next";

import { CircleFlag } from 'react-circle-flags'

import BaseLayout from "../layouts/base";
import { trpc } from "../utils/trpc";

const LeaderBoardPage: NextPage = () => {
  const resp = trpc.naseliga.getLeaderBoard.useQuery();

  return (
    <BaseLayout>
      <div className="container max-w-sm">
        {resp.data?.leaderboard.map((entry, idx) =>
          <div key={entry.id} className={
            'flex items-center rounded-full m-3 p-5 '
            + ({
              0: 'bg-yellow-400',
            }[idx] || 'bg-zinc-50')
          }>
            <div className="m-3"><strong>{idx + 1}</strong></div>
            <div className="m-3 w-8">
              {entry.country && <CircleFlag countryCode={entry.country.toLowerCase()} />}
            </div>
            <div className="flex-1 text-xl capitalize">{entry.name}</div>
            <div><strong>{entry.score}</strong></div>
          </div>
        )}
        { /* default */}
        {!resp.data && [...Array(5)].map((_, idx) =>
          <div key={idx} className="flex rounded-full m-3 p-10 bg-zinc-50 animate-pulse" />
        )}
      </div >
    </BaseLayout>
  );
}

export default LeaderBoardPage;