import Head from "next/head";
import { useState } from "react";

import { BannerHome } from "../components/BannerHome";

import { fetcher } from '../services/clientContentful';
import { fetcherTmdb } from '../services/tmdb';

import { generateCanonicalUrl } from "../utils/generateCanonical";

export default function Home({ highlightsBanner }) {
   const [isTrailer, setIsTrailer] = useState(false);

   return (
      <>
         <Head>
            <title>Streaming Website</title>
            <meta
               name="description"
               content={`Tudo sobre filmes, séries, desenhos, animações.`}
            />

            <link rel="canonical" href={generateCanonicalUrl()} />

         </Head>
         <main>
            <BannerHome
               items={highlightsBanner.items}
               isTrailer={isTrailer}
               getTrailer={setIsTrailer}
            />

         </main>
      </>
   )
}

export async function getServerSideProps() {
   const select = ['title', 'poster', 'backdrop', 'id', 'url', 'mode', 'informations', 'releaseDate', 'certification']
      .map(item => 'fields.' + item).join(',');

   const headerContent = [
      {
         title: "Filmes Novos",
         more: 'filmes/?page=1&filter=releaseDate.asc',
         list: await fetcher({
            content_type: 'content',
            select,
            "fields.mode": "movie",
            order: '-fields.releaseDate,fields.popularity',
            limit: 10
         })
      },
      {
         title: "Séries Mais Populares",
         more: 'series/?page=1&filter=releaseDate.asc',
         list: await fetcher({
            content_type: 'content',
            "metadata.tags.sys.id[nin]": '16',
            select,
            "fields.mode": "tv",
            order: '-fields.popularity,-fields.releaseDate',
            limit: 20
         })
      },
      {
         title: "Filmes Mais Populares",
         more: 'filmes/?page=1&filter=popularity.asc',
         list: await fetcher({
            content_type: 'content',
            "metadata.tags.sys.id[nin]": '16',
            select,
            "fields.mode": 'movie',
            order: '-fields.popularity,-fields.releaseDate',
            limit: 20
         })
      },
      {
         title: "Novas Temporadas",
         more: '',
         list: await fetcher({
            content_type: 'season',
            order: '-fields.releaseDate',
            limit: 10
         })
      }
   ]

   const explorerQuery = await fetcherTmdb('discover', 'movie', false, 3);
   const trailersContent = explorerQuery.results.filter(item => {
      return item.backdrop_path && item.original_language === 'en';
   }).slice(0, 12);

   const moreContent = [
      {
         title: "Animações",
         more: 'animacoes/?page=1&filter=popularity.asc',
         list: await fetcher({
            content_type: 'content',
            'fields.mode': 'movie',
            select,
            "metadata.tags.sys.id[all]": "16",
            "fields.language": 'en',
            order: '-fields.popularity,-fields.releaseDate',
            limit: 10,
         })
      }, {
         title: "Animes",
         more: 'animes/?page=1&filter=popularity.asc',
         list: await fetcher({
            content_type: 'content',
            select,
            "fields.language[all]": "ja",
            order: '-fields.popularity,-fields.releaseDate',
            limit: 15
         })
      },
      {
         title: 'Bem Avaliados',
         more: '',
         list: await fetcher({
            content_type: 'content',
            select,
            "metadata.tags.sys.id[nin]": "16",
            "fields.totalVotes[gte]": 200,
            order: '-fields.votes,-fields.popularity',
            limit: 10
         })
      },
      {
         title: "Séries Animadas",
         more: 'desenhos/?page=1&filter=popularity.asc',
         list: await fetcher({
            content_type: 'content',
            select,
            'fields.mode': 'tv',
            "metadata.tags.sys.id[all]": "16",
            "fields.language[nin]": 'ja',
            order: '-fields.popularity,-fields.releaseDate',
            limit: 10,
         })
      },
      {
         title: "Clássicos",
         more: '',
         list: await fetcher({
            content_type: 'content',
            "metadata.tags.sys.id[nin]": "16",
            select,
            order: 'fields.releaseDate,-fields.votes',
            limit: 10
         })
      }
   ]

   const highlightsBanner = await fetcher({
      content_type: 'content',
      select,
      order: '-fields.popularity,-fields.releaseDate',
      limit: 6
   })

   return {
      props: {
         highlightsBanner,
         headerContent,
         moreContent,
         trailersContent
      }
   }
}