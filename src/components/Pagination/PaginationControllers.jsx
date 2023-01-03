import Link from 'next/link';
import { useRouter } from 'next/router';

import categories from './categories.module.css';

export function ControllersPagination({
   currentPage, totalPages, currentFilter
}) {
   const path = useRouter();

   function numeration(page, isActive, name) {
      const active = isActive ? categories.activePage : '';

      return (
         <Link 
            href={`/elenco/${path.query.id}?rel=${path.query.rel}&page=${page}&filter=${currentFilter}`} 
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

   return (
      <section className={categories['pagination']}>

         <div>Página {currentPage} de {totalPages}</div>

         <nav className={categories['controllers']}>
            {
               Array.from(
                  { length: totalPages },
                  (_, index) => {
                     return handlePagination(index)
                  })
            }
         </nav>
      </section>
   )
}