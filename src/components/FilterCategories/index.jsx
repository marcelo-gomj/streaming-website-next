import Link from 'next/link';
import filter from './filter.module.css';

export function FilterCategories({ category, current }){
   const orderType = {
      "releaseDate.asc" : "Mais Recentes",
      "releaseDate.desc" : "Mais Antigos",
      "popularity.asc" : "Mais populares",
      "popularity.desc" : "Menos populares",
      "votes.asc" : "Bem avaliados",
      'title.desc' : 'Titula A...Z', 
      'title.asc' : 'Titulo Z...A'
   }

   function selectFilter(type){
      return '&filter=' + type;
   }
   const activeFilter = orderType[current]
   return (
      <div className={filter['filter-container']}>
         
         <div className={filter['filter-active']}>{activeFilter}</div>

         <ul className={filter['filter-list']}>
            {
               Object.keys(orderType).map((type) => {
                  const filterName = orderType[type];

                  if(type !== current){
                     return (
                        <li
                           key={type}
                        >  
                           <Link href={`/${category}/?page=1${selectFilter(type)}`}>
                              <>
                                 {filterName}
                              </>
                           </Link>
                        </li>
                     )
                  }
               })
            }
         </ul>
      </div>
   )
}