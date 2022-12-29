import React from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import type {
  EventsRouterOutput,
  EventsRouterInput,
} from "../server/trpc/router/events";
import { AddButton } from "./buttons";
import { trpc } from "../utils/trpc";

// Same as EventsRouterInput["create"] but without id, and date as string
type NewEventForm = Omit<Omit<EventsRouterInput["create"], "id">, "date"> & {
  date: string;
};

const EventCreateForm: React.FC = () => {
  const utils = trpc.useContext();

  const today = new Date();

  const form = useForm<NewEventForm>({
    defaultValues: {
      date: today.toISOString().split("T")[0],
      title: `${today.toLocaleString("default", { weekday: "long" })} squash`,
    },
  });

  const mutation = trpc.events.create.useMutation({
    onSuccess: () => {
      utils.events.invalidate();
    },
  });

  return (
    <EventCreateFormView
      isLoading={mutation.isLoading}
      form={form}
      createNewEvent={(data) => {
        return mutation.mutateAsync({
          ...data,
          date: new Date(data.date),
        });
      }}
    />
  );
};

export default EventCreateForm;

type EventCreateFormViewProps = {
  isLoading: boolean;
  form: ReturnType<typeof useForm<NewEventForm>>;
  createNewEvent: (data: NewEventForm) => Promise<EventsRouterOutput["create"]>;
};

const EventCreateFormView: React.FC<EventCreateFormViewProps> = ({
  isLoading,
  form,
  createNewEvent,
}) => {
  const { handleSubmit, register } = form;

  const doSubmit = handleSubmit((data) =>
    createNewEvent(data)
      .then(() => toast.success("Event created 🎉"))
      .catch((err) => toast.error(err.message))
  );

  return (
    <form className="flex gap-2" onSubmit={doSubmit}>
      <input
        className="border border-gray-300 p-2"
        type="text"
        placeholder="Event title"
        {...register("title")}
      />
      <input
        className="border border-gray-300 p-2"
        type="date"
        placeholder="Date"
        required
        {...register("date")}
      />
      <AddButton disabled={isLoading} type="submit" />
    </form>
  );
};
