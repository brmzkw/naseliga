import React, { type PropsWithChildren } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Caveat } from '@next/font/google'
import Link from "next/link";


const font = Caveat()

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const { data: sessionData } = useSession();

    return (
        <>
            <Head>
                <title>Naseliga, our squash ligue in Prague</title>
                <meta name="description" content="Our squash ligue in Prague" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <menu>
                <div className={`
        p-3 font-bold shadow-grey shadow-md
        ${font.className} text-3xl
        flex
      `}>
                    <div className="flex-1 text-center">
                        <Link href="/">Naseliga, our squash ligue in Prague</Link>
                    </div>

                    <button onClick={sessionData ? () => signOut() : () => signIn("github")}>
                        <picture>
                            <img
                                className="rounded-full h-10 w-10"
                                src={(sessionData?.user?.image && sessionData.user.image) || "/GitHub-Mark/PNG/GitHub-Mark-64px.png"}
                                title={sessionData ? "Logout" : "Login with GitHub"}
                                alt={sessionData ? "Logout" : "Login with GitHub"}
                            />
                        </picture>
                    </button>
                </div>

                {sessionData?.user?.isAdmin &&
                    <ul className="flex font-bold shadow-grey shadow-md bg-stone-100 text-slate-800">
                        <li className="m-3"><Link href="/">Leaderboard</Link></li>
                        <li className="m-3"><Link href="/admin">Administration</Link></li>
                    </ul>}
            </menu>

            <main className="min-h-screen flex flex-col sm:flex-row">
                {children}
            </main>

            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </>
    );
}

export default BaseLayout;