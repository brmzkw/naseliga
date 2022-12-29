import React from "react";

import toast from "react-hot-toast";

import type { EventsRouterInput } from "../server/trpc/router/events";
import { RemoveButton } from "./buttons";
import { trpc } from "../utils/trpc";

type EventRemoveButtonProps = {
  event: EventsRouterInput["delete"];
};

const EventRemoveButton: React.FC<EventRemoveButtonProps> = ({ event }) => {
  const utils = trpc.useContext();

  const mutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      utils.events.invalidate();
      toast.success("Event deleted 😵‍💫");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <RemoveButton
      disabled={mutation.isLoading}
      onClick={() => mutation.mutate(event)}
    />
  );
};

export default EventRemoveButton;
