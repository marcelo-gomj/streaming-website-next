import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";

import { fetcher } from "../../services/clientContentful";
import { fetcherTmdb } from "../../services/tmdb";
import { parserUrl } from "../../utils/slug";
import { reduceContent } from "../../utils/reduceTmdbContentApi"; 
// import { GenerateCanonicalUrl } from "../../utils/GenerateCanonical";

import { CastSection } from "../../components/CastSection";
import { FooterContent } from "../../components/FooterContent";
import { MoreDetails } from "../../components/MoreDetails";
import { HeaderContent } from "../../components/HeaderContent";
import { SeasonsList } from '../../components/SeasonsList';
import { ModalChoose } from "../../components/ModalChoose";


const Modal = dynamic(() =>
   import('../../components/Modal').then(mod => mod.Modal)
);

const TrailerIframe = dynamic(() =>
   import('../../components/TrailerIframe').then(mod => mod.TrailerIframe)
)

export default function ContentPage({
   contents,
   category,
   type,
   actorList,
   recommendsList,
   seasonSelected,
}) {
   const [isModal, setIsModal] = useState(false);
   const [watchModal, setWatchModal] = useState(false);

   const info = {
      title: (contents.title || contents.name) + (seasonSelected ? ` - ${seasonSelected.season_number}ª Temporada` : ''),
      poster: seasonSelected?.poster_path || contents.poster_path,
      castItems: actorList?.items[0].fields.tmdb.credits,
      recommends: recommendsList,
      overview: seasonSelected?.overview || contents.overview,
      modalName: seasonSelected !== undefined ? "Assistir em : " : "Selecione a Temporada",
      seasonSelected
   }
   // const canonical = GenerateCanonicalUrl();

   return (
      <>
         <Head>
            <title>{contents.title}</title>
            <meta name="description" content={contents.description} />
            {/* <link rel="canonical" href={canonical} /> */}
         </Head>

         <main style={{ overflow: "hidden" }}>
            <HeaderContent
               content={info}
               item={contents}
               seasonSelected={seasonSelected}
               setIsModal={setIsModal}
               setWatchModal={setWatchModal}
            />

            <MoreDetails item={contents} />

            <CastSection
               castItems={info.castItems}
               itemID={contents.id}
            />

            <FooterContent
               recommends={info.recommends}
               category={category}
               seasonSelected={seasonSelected}
            />


            {
               <Modal
                  isModal={isModal}
                  setModal={setIsModal}
               >
                  <TrailerIframe
                     videosList={contents.videos}
                     videoID={{
                        id: contents.id,
                        type
                     }}
                  />
               </Modal>
            }

            <ModalChoose
               watchModal={watchModal}
               closeModal={setWatchModal}
               opacity={0.6}
               hdTitle={info.modalName}
            >
               {
                  seasonSelected === false ?

                     <SeasonsList
                        seasons={contents.seasons}
                        poster={contents.poster_path}
                     />

                     :

                     ""
               }
            </ModalChoose>


         </main>
      </>
   )
}

export async function getStaticPaths() {
   const res = await fetcher({
      content_type: 'content',
      select: 'fields.id,fields.mode,fields.url,fields.title,fields.informations',
      order: '-fields.popularity',

      limit: 2
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

   function matchSeasonByMode(seasons, seasonNumber) {
      if (!seasonNumber) return false;

      const [season] = seasons.filter(season => season.season_number === seasonNumber);

      return {
         ...season,
         id: season.id,
         name: season.name,
         season_id: season.id,
         seasson_name: `${season.name}`,
      }
   }

   const { category, id } = params;
   const [identityParam, seasonParam] = id;

   const { type, tmdbID } = splitUrlParamsId(identityParam);
   const seasonNumber = hasSeasonNumber(seasonParam);

   const actorList = await fetcher({
      content_type: 'content',
      "fields.id": tmdbID,
      select: "fields.tmdb"
   });

   const recommendsList = await queryRecommendsItems(category, tmdbID);

   const queryTmdbExtraContent = "&append_to_response=videos,release_dates,content_ratings";
   const tmdbContents = await fetcherTmdb(type, tmdbID, false, 3, queryTmdbExtraContent);

   const seasonSelected = type === 'tv' ?
      matchSeasonByMode(tmdbContents.seasons, seasonNumber) : null;

   const reducedContentFinal = reduceContent(tmdbContents);

   return {
      props: {
         contents: reducedContentFinal,
         category,
         type,
         actorList,
         recommendsList,
         seasonSelected,
      },
      revalidate: 60 * 60 * 24 // 24 hours
   }
}