import Head from "next/head";

import { generateCanonicalUrl } from "../../utils/generateCanonical";
import { fetcher } from "../../services/clientContentful";

export default function CategoryPage({ list, categoryTitle, totalPages, currentPage, currentFilter }) {
   const fixTitle = {
      "filmes" : "Filmes",
      "series" : "Séries",
      "animes" : "Animes",
      "desenhos" : "Desenhos",
      "animacoes" : "Animações"
   }

   const titleHeader = fixTitle[categoryTitle];

   return (
      <>
         <Head>
            <title>{titleHeader} - pag. {currentPage}</title>

            <meta
               name="description"
               content={`Melhores ${titleHeader}`}
            />

            <link rel="canonical" href={generateCanonicalUrl()} />
         </Head>
      </>
   )
}

export async function getServerSideProps({ query, params }){
   let { category } = params;
   let { page, filter } = query;
 
   if( !page && !filter ){
      page = 1;
      category = category.split('&')[0]
   }

   const select = ['title', 'poster', 'backdrop', 'id', 'url', 'mode', 'informations', 'releaseDate', 'certification']
      .map(item => 'fields.' + item).join(',');

   function getPageIndex(page = 1){
      return (page - 1) * 30
   }

   function calcTotalPages(itemsTotal){
      let rest = 0;
      const pages = Math.trunc(itemsTotal / 30);
      
      if( pages && itemsTotal % 30 ){
         rest = 1;
      }

      return (pages + rest) || 1
   }

   function orderContent(entry){

      if(entry){
         const [filter, sinal] = entry.split('.');
         const order = sinal === 'asc' ? '-' : '';

         return order + 'fields.' + filter
      }

      return '-fields.releaseDate'; 
   }

   const data = await fetcher({
      content_type: 'content',
      select,
      "metadata.tags.sys.id[all]": category,
      order : orderContent(filter),
      skip : getPageIndex(page),
      limit: 30
   })

   const currentFilter = filter || 'releaseDate.asc';

   return {
      props: {
         categoryTitle : category,
         totalPages : calcTotalPages(data.total),
         currentFilter,
         list: data,
         currentPage : page || 1
      }
   }
}