import Head from "next/head";
import Link from "next/link";
import React from "react";

const BaseLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Head>
                <title>Naseliga, our squash ligue in Prague</title>
                <meta name="description" content="Our squash ligue in Prague" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Menu />

            <main className="flex min-h-screen flex-col items-center bg-teal-900">
                {children}
            </main>
        </>
    );
}

export default BaseLayout;

const Menu: React.FC = () => {
    return (
        <menu className="containe flex bg-pink-900 text-white">
            <li className="p-3 font-bold">
                <Link href="/">Leaderboard </Link>
            </li>
            <li className="p-3">
                <Link href="/events">Events</Link>
            </li>
        </menu>
    );
};