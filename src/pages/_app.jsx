import Router from "next/router";
import nProgress from "nprogress";
import { useEffect, useState, createContext } from 'react';

import { Layout } from '../components/Layout';

import '../styles/globals.css';
import "../styles/nprogress.css";

export const SizeScreen = createContext(null);

function StreamingWebsite({ Component, pageProps }) {
   const [sizes, setSizes] = useState(false);
   nProgress.configure({ showSpinner: false })

   useEffect(() => {
      const handleRouteStart = () => nProgress.start();
      const handleRouteDone = () => nProgress.done();

      Router.events.on("routeChangeStart", handleRouteStart);
      Router.events.on("routeChangeComplete", handleRouteDone);
      Router.events.on("routeChangeError", handleRouteDone);

      return () => {
         Router.events.off("routeChangeStart", handleRouteStart);
         Router.events.off("routeChangeComplete", handleRouteDone);
         Router.events.off("routeChangeError", handleRouteDone);
      };
   }, []);

   useEffect(() => {
      const screens = [1501, 1500, 768, 480, 320];
      const types = {
         poster: [500, 300, 185, 154, 92],
         miniCover: [154, 154, 154, 92, 92],
         backdrop: [1280, 1280, 780, 780, 300]
      }

      screens.map((screen, index) => {
         const mq = window.matchMedia(`(${index === 0 ? 'min' : 'max'}-width:${screen}px)`);

         const poster = types.poster[index];
         const miniCover = types.miniCover[index];
         const backdrop = types.backdrop[index];

         if (mq.matches) {
            setSizes({
               poster,
               miniCover,
               backdrop
            })
         }
      })
   }, []);

   return (
      <SizeScreen.Provider value={sizes}>
         <Layout>
            <Component {...pageProps} />
         </Layout>
      </SizeScreen.Provider>
   )
}

export default StreamingWebsite