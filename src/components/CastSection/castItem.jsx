import cast from './cast.module.css';
import Link from 'next/link';
import { ImageTmdb } from "../ImageTmdb";
import slugify from 'slugify';
import Actor from '../../assets/no-actor.svg';

export function CastItem({ person, itemID }){
   const isMen = person.gender === 2;

   return (
      <li 
         className={cast["cast-item"]}
      >
         <Link href={`/elenco/${slugify(person.name)}-${person.id}?rel=${itemID}`}>
            <div className={cast["cast-profile"]}>
               {person.profile_path ? 
                  <ImageTmdb 
                     type={'poster'} 
                     path={person.profile_path} 
                     alt={`image ${isMen ? 'do': 'da'} `+ person.name}
                  /> :
                  <Actor />
               }
            </div>

            <div className={cast["cast-description"]}>
               <h3>{person.name}</h3>
               <p>{person.character}</p>
            </div>
         </Link>

      </li>
   )
} 