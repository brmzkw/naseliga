import React from "react";

import toast from "react-hot-toast";

import type { EventsRouterInput } from "../server/trpc/router/events";
import { RemoveButton } from "./buttons";
import { trpc } from "../utils/trpc";

type MatchRemoveButtonProps = {
  match: EventsRouterInput["deleteMatch"];
};

export const MatchRemoveButton: React.FC<MatchRemoveButtonProps> = ({
  match,
}) => {
  const utils = trpc.useContext();

  const mutation = trpc.events.deleteMatch.useMutation({
    onSuccess: () => {
      utils.events.invalidate();
      toast.success("Match deleted 💫");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <RemoveButton
      disabled={mutation.isLoading}
      onClick={() => mutation.mutate({ id: match.id })}
    />
  );
};
