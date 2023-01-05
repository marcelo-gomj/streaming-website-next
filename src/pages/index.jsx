import Head from "next/head";
import { useState } from "react";

import { BannerHome } from "../components/BannerHome";
import { RowContainer } from '../components/RowContainer';
import { RowItems } from "../components/RowItems";
import { RowTrailers } from "../components/RowTrailers";
import { Modal } from "../components/Modal";
import { TrailerIframe } from "../components/TrailerIframe";

import { fetcher } from '../services/clientContentful';
import { fetcherTmdb } from '../services/tmdb';
// import { GenerateCanonicalUrl } from "../utils/GenerateCanonical";

import home from "../styles/home.module.css";

export default function Home({ highlightsBanner, headerContent, trailersContent, moreContent }) {
   const [isTrailer, setIsTrailer] = useState(false);
   const sizes = {
      "500" : 1.5,
      "768" : 2,
      "1100" : 2.5,
      "default" : 3
   }

   const sizesTrailer = {
      "768" : 1,
      "1100" : 1.5,
      "default" : 2
   }

   // const canonical = GenerateCanonicalUrl()
   return (
      <>
         <Head>
            <title>Streaming Website</title>
            <meta
               name="description"
               content={`Tudo sobre filmes, séries, desenhos, animações.`}
            />

            {/* <link rel="canonical" href={canonical} /> */}

         </Head>
         <main className={home["content"]}>
            <BannerHome
               items={highlightsBanner.items}
               isTrailer={isTrailer}
               getTrailer={setIsTrailer}
            />

            {
               headerContent.map((content) => {
                  if (content.list.items.length) {
                     const itemsLength = content.list.items.length;

                     return (
                        <RowContainer
                           key={content.title}
                           title={content.title}
                           length={itemsLength}
                           more={content.more}
                           screens={sizes}
                        >
                           <RowItems items={content.list.items} />
                        </RowContainer>
                     )

                  }
               })
            }

            <RowContainer
               key={3232}
               title={'Filmes em Breve'}
               length={trailersContent.length}
               screens={sizesTrailer}
            >
               <RowTrailers 
                  items={trailersContent} 
                  getTrailer={setIsTrailer}
               />
            </RowContainer>

            {
               moreContent.map((content) => {
                  if(content.list.items.length){
                     const itemsLength = content.list.items.length;

                     return (
                        <RowContainer
                           key={content.title}
                           title={content.title}
                           more={content.more}
                           length={itemsLength}
                           screens={sizes}
                        >
                           <RowItems items={content.list.items} />
                        </RowContainer>
                     )
                  }
               }
            )}

            <Modal
               isModal={isTrailer}
               setModal={setIsTrailer}
            >
               <TrailerIframe videoID={isTrailer} />
            </Modal>
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