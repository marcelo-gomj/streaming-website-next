import Head from "next/head";
import Link from "next/link";

// import { GenerateCanonicalUrl } from "../../utils/GenerateCanonical";
import { fetcher } from "../../services/clientContentful";

import { CardItem } from '../../components/CardItem';
import { FilterCategories } from '../../components/FilterCategories';

import categories from '../../styles/categories.module.css';

export default function CategoryPage({ list, categoryTitle, totalPages, currentPage, currentFilter }) {
   const fixTitle = {
      "filmes" : "Filmes",
      "series" : "Séries",
      "animes" : "Animes",
      "desenhos" : "Desenhos",
      "animacoes" : "Animações"
   }

   const titleHeader = fixTitle[categoryTitle];

   function numeration(page, isActive, name) {
      const active = isActive ? categories.activePage : '';

      return (
         <Link 
            href={`${categoryTitle}/?page=${page}&filter=${currentFilter}`} 
            key={page} className={active}>{page}
         </Link>
      )
   }

   function handlePagination(index, list) {
      // const { total_pages, page, name } = list;
      const page = currentPage;
      const total_pages = totalPages;
      const name = 'more'

      const current = index + 1
      const matchedItem = page == current;
      const divisor = 5
      const squareItem = numeration(current, matchedItem, name);

      if (total_pages !== 1) {
         if (page < divisor && current <= divisor) {
            return squareItem;

         } else if (page >= divisor && current === 1 && total_pages !== current) {
            return [numeration(1, matchedItem, name), <span key={2}>...</span>]

         } else if (page > (total_pages - (divisor - 1)) && current > (total_pages - divisor)) {
            return squareItem;

         } else if (current === total_pages) {
            return [<span key={current - 1}>...</span>, numeration(current, false, name)]

         } else {
            if (current > (page - 3) && current < (page + 3)) {
               return squareItem;
            }
         }
      }
   }

   const titlePage = {titleHeader} + "- pag." + {currentPage}; 
   // const canonical = GenerateCanonicalUrl();

   return (
      <>
         <Head>
            <title>{titlePage}</title>

            <meta
               name="description"
               content={`Tudo sobre ${titleHeader}`}
            />

            {/* <link rel="canonical" href={canonical} /> */}
         </Head>

         <main>
         <main>
            <section className={categories['container']}>
               <header className={categories['header']}>

                  <div className={categories['title']}>
                     <h1>{titleHeader}</h1>
                  </div>

                  <FilterCategories 
                     category={categoryTitle}
                     current={currentFilter}
                  />
               </header>

               <ul className={categories.items}>
                  {
                     list.items.map((item) => {
                        return (
                           <CardItem
                              item={item}
                              key={item.fields.id}
                           />
                        )
                     })
                  }
               </ul>
            </section>

            <section className={categories['pagination']}>
               
               <div>Página {currentPage} de {totalPages}</div>

               <nav className={categories['controllers']}>
                  {
                     Array.from(
                        { length: totalPages },
                        (_, index) => {
                           return handlePagination(index, list)
                        }
                     )
                  }
               </nav>
            </section>
         </main>
         </main>
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