
import { ContentDetails } from '../Details';
import { ImageTmdb } from '../ImageTmdb';
import { TagList } from './TagList';

import TrailerIcon from '../../assets/trailer.svg';
import style from './header.module.css';

export function HeaderContent({
   content, item,
   setIsModal, setWatchModal, seasonSelected
}) {

   return (
      <section className={style.backdrop}>

         <ImageTmdb
            path={item.backdrop_path}
            type='backdrop'
            alt={' backdrop'}
         />

         <header className={style.header}>
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

                  <div className={style.buttons}>
                     {seasonSelected !== false ?
                     <button
                        className={style["watch-button"]}
                        onClick={() => setWatchModal(true)}
                     >
                        Disponível em
                     </button>

                     :

                     <button
                        className={style.seasons}
                        onClick={() => setWatchModal(true)}
                     >
                        Selecione a Temporada
                     </button>}

                     <button
                        className={style.trailerBtn}
                        onClick={() => setIsModal(true)}
                     >
                        <span className={style.trailerIcon}><TrailerIcon /></span>
                        Assistir trailer
                     </button>
                  </div>
               </div>
            </div>

            <ContentDetails
               item={item}
               seasonSelected={content.seasonSelected}
            />
         </header>

      </section>
   )
} 