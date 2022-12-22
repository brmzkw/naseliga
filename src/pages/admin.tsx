import React from "react";

import { type NextPage } from "next";

import BaseLayout from "../layouts/base";
import PlayerCreateForm from "../components/player-create-form";
import PlayersList from "../components/players-list";

const AdminPage: NextPage = () => {
    return (
        <BaseLayout>
            <div className="m-3">
                <div>
                    <h2 className="font-bold mb-2">List of players</h2>
                    <PlayersList />

                    <h2 className="font-bold mt-2 mb-2">Add a new player</h2>
                    <PlayerCreateForm />
                </div>
            </div>
        </BaseLayout>
    );
}

export default AdminPage;