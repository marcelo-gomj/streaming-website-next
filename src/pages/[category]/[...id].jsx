import Head from "next/head";
import { fetcher } from "../../services/clientContentful";
import { parserUrl } from "../../utils/slug";

export default function ContentPage({

}){
   return (
      <>
         <Head>
            <title></title>
         </Head>
      </>
   )
}

export async function getStaticPaths(){
   const res = await fetcher({
      content_type: 'content',
      select: 'fields.id,fields.mode,fields.url,fields.title,fields.informations',
      order: '-fields.popularity',

      limit: 60
   })

   const paths = res.items.map(({ fields }) => {
      const category = fields.informations.genres.filter(item => !Number(item.id))[0].id
   
      const url = parserUrl( fields.url, {
         id: fields.id,
         mode: fields.mode,
         category
      })

      const splitParams = url.split('/').filter( item => item );

      return { params : { category, id : [splitParams[1]]  } }
   })

   return {
      paths,
      fallback: 'blocking'
   }
}

export async function getStaticProps(){
   return {
      props: {},
      revalidate: 60 * 60 * 24 // 24 hours
   }
}