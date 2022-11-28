import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
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
    const router = useRouter();
    const menus = [
        {
            path: "/",
            text: "Leaderboard",
        },
        {
            path: "/events",
            text: "Events",
        },
    ];

    return (
        <menu className="containe flex bg-pink-900 text-white">
            {menus.map((menu) =>
                <li key={menu.path} className={`p-3 ` + (menu.path === router.asPath ? 'font-bold' : '')}>
                    <Link href={menu.path}>{menu.text}</Link>
                </li>
            )}
        </menu>
    );
};