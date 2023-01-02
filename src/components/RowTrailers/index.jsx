import { memo } from 'react';

import { ImageTmdb } from '../ImageTmdb';

import trailers from './trailers.module.css';
import IconPlay from '../../assets/play.svg';

function ListTrailers({ items, getTrailer }) {
   return (
      <ul className={trailers['items']}>
         {items.map((item, index) => {
            let releaseDate = ''
             
            if(item.release_date){
               releaseDate = 'Lançamento ' + item.release_date.split('-').reverse().join('/');
            }

            const type = item.title ? 'movie' : 'tv';

            return (
               <li key={item.id}>
                  <div 
                     className={trailers['card-trailer']}
                     onClick={() => getTrailer({ id: item.id, type })}   
                  >
                     <div className={trailers['card-poster']}>
                        <ImageTmdb
                           path={item.backdrop_path}
                           type={'backdrop'}
                           alt={(item.name || item.title) + ' trailer cover'}
                           priority={index < 4}
                        />
                        
                        <IconPlay />

                        <div className={trailers['release-date']}>
                           <p>{releaseDate}</p>
                        </div>
                     </div>

                     <div className={trailers['card-description']}>
                        <h3>{item.title}</h3>
                     </div>

                  </div>
               </li>
            )
         })}
      </ul>
   )
}

export const RowTrailers = memo(ListTrailers);