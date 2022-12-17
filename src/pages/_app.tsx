import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { Toaster } from 'react-hot-toast';

import { trpc } from "../utils/trpc";
import { Mulish } from '@next/font/google'

import "../styles/globals.css";

const font = Mulish()

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
    html {
      font-family: ${font.style.fontFamily};
    }
  `}</style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
