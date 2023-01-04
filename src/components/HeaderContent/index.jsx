import { Header } from './Header'
import { ContentDetails } from '../Details';
import { ImageTmdb } from '../ImageTmdb';

import style from './header.module.css';

export function HeaderContent({
   content, item, 
}) {

   return (
      <section className={style.backdrop}>

         <ImageTmdb
            path={item.backdrop_path}
            type='backdrop'
            alt={' backdrop'}
         />

         <header className={style.header}>
            <Header
               content={content}
               item={item}
            />

            <ContentDetails item={item} />
         </header>
         
      </section>
   )
} 