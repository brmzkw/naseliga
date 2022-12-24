import React from "react";
import type { EventsRouterOutput } from "../server/trpc/router/events";
import { trpc } from "../utils/trpc";

export type Event = EventsRouterOutput["list"][number];
export type NullableEvent = Event | null;

type EventHistoryBrowserProps = {
    getTitle: (event: Event, isFirst: boolean) => React.ReactNode;
    getWrappedChildren: (event: NullableEvent) => React.ReactNode;
};

/*
    This component allows user to select an event, and renders children which
    can get the selected event from the provider.
*/
const EventHistoryBrowser: React.FC<EventHistoryBrowserProps> = ({
    getTitle,
    getWrappedChildren,
}) => {
    const query = trpc.events.list.useQuery();

    const [selectedEvent, setSelectedEvent] = React.useState<NullableEvent>(null);

    const searchIdx = query.data?.findIndex((event) => event.id === selectedEvent?.id) ?? 0;
    const currentIdx = searchIdx === -1 ? 0 : searchIdx;

    const prevEvent = query.data?.[currentIdx + 1];
    const currentEvent = query.data?.[currentIdx];
    const nextEvent = query.data?.[currentIdx - 1];

    const WrappedChildren = getWrappedChildren(selectedEvent);

    return (
        <div>
            <div className="flex justify-around mb-2 p-2 shadow-md shadow-slate-900">
                <div>
                    {prevEvent && (
                        <button
                            className=""
                            onClick={() => setSelectedEvent(prevEvent)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                        </button>
                    )}
                </div>
                <div className="flex-1 text-center">
                    {
                        currentEvent && getTitle(
                            currentEvent,
                            currentIdx == 0,
                        )
                    }
                </div>
                <div>
                    {nextEvent &&
                        <button
                            className=""
                            onClick={() => setSelectedEvent(nextEvent)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    }
                </div>
            </div>
            {WrappedChildren}
        </div >
    );
};

export default EventHistoryBrowser;