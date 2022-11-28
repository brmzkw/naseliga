import { type NextPage } from "next";

import { CircleFlag } from 'react-circle-flags'

import BaseLayout from "../layouts/base";
import { trpc } from "../utils/trpc";

const EventsPage: NextPage = () => {
    const resp = trpc.naseliga.getLeaderBoard.useQuery();

    return (
        <BaseLayout>
            Events list
        </BaseLayout>
    );
}

export default EventsPage;