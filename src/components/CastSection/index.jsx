import { CastItem } from './castItem';
import cast from './cast.module.css';

export function CastSection({ castItems, itemID }){
   return (
      <section className={cast["container"]}>
         <header>
            <h2>Elenco</h2>
         </header>
         
         <ul className={cast["cast-list"]}>
            { castItems ? castItems.map(person => (
                  <CastItem
                     key={person.id} 
                     person={person} 
                     itemID={itemID} 
                  />
               ))  : ''
            }
         </ul>
      </section>
   )
}