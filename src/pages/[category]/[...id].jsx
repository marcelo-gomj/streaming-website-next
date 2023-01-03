import Head from "next/head";
import { fetcher } from "../../services/clientContentful";
import { parserUrl } from "../../utils/slug";

export default function ContentPage({

}) {
   return (
      <>
         <Head>
            <title></title>
         </Head>
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

   const { category, id } = params;
   const [identityParam, seasonParam] = id;

   const { type, tmdbID } = splitUrlParamsId(identityParam);
   const seasonNumber = hasSeasonNumber(seasonParam);

   const actorList = await fetcher({
      content_type: 'content',
      "fields.id" : tmdbID, 
      select: "fields.tmdb"
   });

   const recommendsList = await queryRecommendsItems(category, tmdbID);

   console.log("tmdbID: " + tmdbID);
   console.log("seasonNumber: " + seasonNumber);
   console.log("type: " + type);
   console.log("recommends ", recommendsList);

   return {
      props: {},
      revalidate: 60 * 60 * 24 // 24 hours
   }
}