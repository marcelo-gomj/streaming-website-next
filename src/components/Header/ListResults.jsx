import Link from 'next/link';
import search from './search.module.css';
import { parserUrl } from '../../utils/slug';

import { ImageTmdb } from '../ImageTmdb';

export function ListResults({ results }) {

   return <ul className={search['suggestion-results']}>
      {
         results.map(result => {
            const { poster, title, releaseDate, mode, votes } = result.fields;
            const date = releaseDate.slice(0, 4);
            const vote = votes.toFixed(1)
            const type = mode === 'movie' ? 'Filme' : 'Série';

            const { fields } = result;
            const url = parserUrl(fields.url, {
               id: fields.id,
               mode: fields.mode,
               category: fields.informations.genres.filter(item => !Number(item.id))[0].id
            })
         

            return (
               <li key={result.sys.id}>
                  <Link href={url} className={search['suggestion-item']} >
                        <div className={search['suggestion-poster']}>
                           <ImageTmdb
                              type="poster"
                              path={poster}
                              alt={title + ' poster'}
                           />
                        </div>

                        <div className={search['suggestion-descriptions']}>
                           <h3>{title}</h3>
                           <div className={search['description-footer']}>
                              <p>{type} de {date}</p>
                              <p>Avaliações: {vote}</p>
                           </div>
                        </div>
                  </Link>
               </li>
            )
         })
      }
   </ul>
}