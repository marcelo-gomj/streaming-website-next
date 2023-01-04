import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";

import { fetcher } from "../../services/clientContentful";
import { fetcherTmdb } from "../../services/tmdb";
import { parserUrl } from "../../utils/slug";
import { reduceContent } from "../../utils/reduceTmdbContentApi";
import { generateCanonicalUrl } from "../../utils/generateCanonical";

import { CastSection } from "../../components/CastSection";
import { FooterContent } from "../../components/FooterContent" 

const Modal = dynamic(() =>
   import('../../components/Modal').then(mod => mod.Modal)
);

const TrailerIframe = dynamic(() =>
   import('../../components/TrailerIframe').then(mod => mod.TrailerIframe)
)

export default function ContentPage({
   contents,
   category,
   modeContent,
   type,
   actorList,
   recommendsList,
   seasonSelected,
}) {
   const [isModal, setIsModal] = useState(false)

   const content = {
      title: contents.title || contents.name,
      canonical: generateCanonicalUrl(),
      castItems: actorList?.items[0].fields.tmdb.credits,
      recommends: recommendsList, 
   }

   return (
      <>
         <Head>
            <title>{contents.title}</title>
            <meta name="description" content={contents.description} />
            <link rel="canonical" href={contents.canonical} />
         </Head>

         <main>
            <FooterContent recommends={content.recommends} category={category} />


            {
               <Modal
                  isModal={isModal}
                  setModal={setIsModal}
               >
                  <TrailerIframe
                     videosList={contents.videos}
                     videoID={{
                        id: content.id,
                        type
                     }}
                  />
               </Modal>
            }

            <CastSection
               castItems={content.castItems}
               itemID={contents.id}
            />
         </main>
      </>
   )
}

export async function getStaticPaths() {
   const res = await fetcher({
      content_type: 'content',
      select: 'fields.id,fields.mode,fields.url,fields.title,fields.informations',
      order: '-fields.popularity',

      limit: 60
   })

   const paths = res.items.map(({ fields }) => {
      const category = fields.informations.genres.filter(item => !Number(item.id))[0].id

      const url = parserUrl(fields.url, {
         id: fields.id,
         mode: fields.mode,
         category
      })

      const splitParams = url.split('/').filter(item => item);

      return { params: { category, id: [splitParams[1]] } }
   })

   return {
      paths,
      fallback: 'blocking'
   }
}

export async function getStaticProps({ params }) {

   const hasSeasonNumber = (id) => id ? Number(id.split('-')[0]) : 0

   function splitUrlParamsId(param) {
      const idNumber = param.split('-').slice(-1)[0].slice('')
      const tmdbID = idNumber.slice(1)
      const type = idNumber[0] === 'm' ? 'movie' : 'tv'

      return { type, tmdbID }
   }

   async function queryRecommendsItems(category, id) {
      const cardItemsProps = [
         'title', 'poster', 'backdrop',
         'id', 'url', 'mode', 'informations',
         'releaseDate', 'certification'
      ].map(item => 'fields.' + item).join(',');

      const popularItemsList = await fetcher({
         content_type: 'content',
         select: cardItemsProps,
         order: '-fields.popularity',
         "metadata.tags.sys.id[all]": category,
         limit: 10
      })

      return popularItemsList.items.filter(item => item.fields.id !== id)
   }

   function matchSeasonByMode(matchedSesson, content) {

      return {
         ...matchedSesson,
         id: content.id,
         name: content.name,
         season_id: matchedSesson.id,
         seasson_name: `${content.name} - ${content.name}`,
      }
   }

   const { category, id } = params;
   const [identityParam, seasonParam] = id;

   const { type, tmdbID } = splitUrlParamsId(identityParam);
   const seasonNumber = hasSeasonNumber(seasonParam);
   const modeContent = seasonNumber ? 'season' : type;

   const actorList = await fetcher({
      content_type: 'content',
      "fields.id": tmdbID,
      select: "fields.tmdb"
   });

   const recommendsList = await queryRecommendsItems(category, tmdbID);

   const queryTmdbExtraContent = "&append_to_response=videos,release_dates,content_ratings";
   const tmdbContents = await fetcherTmdb(type, tmdbID, false, 3, queryTmdbExtraContent);

   const seasonSelected = modeContent === 'season' ?
      matchSeasonByMode(tmdbContents[seasonNumber], tmdbContents) : null;

   const reducedContentFinal = reduceContent(tmdbContents);

   return {
      props: {
         contents: reducedContentFinal,
         category,
         modeContent,
         type,
         actorList,
         recommendsList,
         seasonSelected,
      },
      revalidate: 60 * 60 * 24 // 24 hours
   }
}