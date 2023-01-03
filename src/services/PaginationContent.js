import { fetcher } from '../services/clientContentful';

export async function PaginationContent(query, params, options) {
   let { page, filter } = query;

   if (!page && !filter) {
      page = 1;
   }

   function getPageIndex(page = 1) {
      return (page - 1) * 30
   }

   function calcTotalPages(itemsTotal) {
      let rest = 0;
      const pages = Math.trunc(itemsTotal / 30);

      if (pages && itemsTotal % 30) {
         rest = 1;
      }

      return (pages + rest) || 1
   }

   function orderContent(entry) {

      if (entry) {
         const [filter, sinal] = entry.split('.');
         const order = sinal === 'asc' ? '-' : '';

         return order + 'fields.' + filter
      }

      return '-fields.releaseDate';
   }

   const data = await fetcher({
      content_type: 'content',
      order: orderContent(filter),
      skip: getPageIndex(page),
      limit: 30,
      ...options
   })

   const currentFilter = filter || 'releaseDate.asc';

   return {
      totalPages: calcTotalPages(data.total),
      currentFilter,
      currentPage: page || 1,
      list: data,
   }
}