import { ImageTmdb } from '../ImageTmdb';
import { TagList } from './TagList';
import { useEffect, useState } from 'react';

import TrailerIcon from '../../assets/trailer.svg';
import style from './header.module.css';

export function Header({
   content, item,
}) {
   const [fixBug, setFixBug] = useState(false);

   useEffect(() => {
      setTimeout(() => setFixBug(true), 0);
   }, [])

   return (
      <div className={style.content}>
         <div className={style.poster}>
            <ImageTmdb
               path={item.poster_path}
               type='poster'
               alt={content.title + ' cover'}
               priority={true}
            />
         </div>

         <div className={style.informations}>
            <h1>{content.title}</h1>
            <TagList tags={item.genres} />

            <p className={style.overview}>
               {content.overview}
            </p>

            { fixBug && <div className={style.buttons}>
               {
                  true ?
                     <button
                        className={style["watch-button"]}
                     >
                        Assistir
                     </button>

                     :

                     <button
                        className={style.seasons}
                     >
                        Selecione a Temporada
                     </button>
               }

               <button
                  className={style.trailerBtn}
               >
                  <span className={style.trailerIcon}><TrailerIcon /></span>
                  Assistir trailer
               </button>
            </div>
            }
         </div>
      </div>
   )
}