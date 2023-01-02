import Link from "next/link";
import { useState, useMemo } from "react";

import { ImageTmdb } from "../ImageTmdb";
import card from './card.module.css';
import { parserUrl } from '../../utils/slug';

export function CardItem({ item }){
   const [hover, setHover] = useState(false);

   const { fields } = item;
   const { certification } = fields;
   const overview = useMemo(() => reduceOverview(fields), [item]);
   const url = parserUrl(fields.url, {
      id: fields.id,
      mode: ( fields.mode || 'tv') ,
      category: fields.informations?.genres.filter(item => !Number(item.id))[0].id || fields.category
   })

   const info = {
      title : fields.title  + ( fields.season ? ' Temporada' : '' ),
      runtime : getUniqueRuntime(fields),
      date : fields.releaseDate?.slice(0, 4) || '',
      certification : 'cert-' + certification,
      id: ( fields.seasonId || fields.id ),
      overview,
      url : url + ( fields.season ? '/' + fields.season + '-temporada' : ''), 
      src: fields.poster || '',
      alt: fields.title + ' poster',
   }

   return (
      <li 
         key={info.id} 
         title={info.title}
      >
         <Link href={info.url} className={card['card']}>

               <div className={card['poster-container']}>

                  <div className={card['poster']}>
                     <ImageTmdb 
                        type={'poster'}
                        path={info.src}
                        alt={info.alt}
                     />
                  </div>

                  <p 
                     className={`${card['overview']} ${hover ? card['read-overview'] : ''}`}
                  >
                     { info.overview }
                  </p>

                  <div className={card['hover-info']}>
                     <div className={`${card['certification']} ${card[info.certification]}`}>
                        { certification }
                     </div>

                     <button 
                        className={card['button-overview']}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                     >
                        resumo
                     </button>
                  </div>
               </div>

               <div className={card['descriptions']}>
                  <h3>{info.title}</h3>

                  <footer>
                     <p>{info.runtime}</p>
                     <p>{info.date}</p>
                  </footer>      
               </div>
         </Link>
      </li>
   )
}

function getUniqueRuntime ({ season, informations }) {
   
   if(!season){
      const { episode_run_time, runtime } = informations;

      const numberRuntime = runtime || (episode_run_time && episode_run_time[0]) || '';

      return ( numberRuntime || '--' ) + ' min';
   }

   return season ? season + ' Temporada' : '';
}

function reduceOverview ({ informations, overview }) {
   const text = informations ? informations?.overview : overview;

   if(text){
      const splited = text.split('');

      if(text.length < 280){
         return text;
      }else{
         splited.length = 280
         splited.push('...');
         return splited.join('');
      }
   }

   return 'Sem resumo no momento';
}
