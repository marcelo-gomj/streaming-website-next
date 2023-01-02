import Link from 'next/link';
import {ImageTmdb} from '../ImageTmdb';
import { useMemo } from 'react';
import { parserUrl } from '../../utils/slug';
import banner from './banner.module.css';

export function BannerItem({ item, show, pauseBanner, getTrailer }){
   const overview = useMemo(() => {
      const text = item.fields.informations.overview.split('');
      
      if(text.length > 250) {
         text.length = 250;
         text.push('...');
      }

      return text.join('')
   }, [item]);

   const details = {
      title : item.fields.title,
      image : item.fields.backdrop,
   }

   const { title, url, id, mode } = item.fields;
   const category = item.fields.informations.genres
   .filter(item => !Number(item.id))[0].id;
   const linkPath = parserUrl(url, { id, mode, category });

   return (
      <li
         style={{ display : show ? 'flex' : 'none' }} 
         className={banner['hero-container']}
      >
         <div className={banner['hero-details']}>
            <div className={banner['details-container']}>
               <h3 className={banner['details-title']}>{ details.title }</h3>
               <p 
                  className={banner['details-overview']}
                  onMouseOver={() => pauseBanner(false)}
                  onMouseOut={() => pauseBanner(true)}
               >{ overview }</p>
               
               <div className={banner['details-buttons']}
                  onMouseOver={() => pauseBanner(false)}
                  onMouseOut={() => pauseBanner(true)}
               >  
                  <Link href={linkPath} className={banner['more-details-now']}>
                     Saber Mais
                  </Link>
                  
                  <button 
                     className={banner['watch-trailer']}
                     onClick={() => getTrailer({
                        id: item.fields.id,
                        type: item.fields.mode
                     })}
                  >Trailer</button>
               </div>
            </div>

         </div>

         <div className={banner['hero-backdrop']}>
            <ImageTmdb 
               type={'backdrop'}
               path={details.image || ''} 
               alt={details.title + ' backdrop'}
            />
         </div>
      </li>
   )
}