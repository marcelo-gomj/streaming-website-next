import categories from './categories.module.css';
import { CardItem } from '../CardItem';

export function PaginationItems({
   list
}) {
   return (
      <section className={categories['container']}>

         {list.items.length ?
            <ul className={categories.items}>{
               list.items.map((item) => {
                  return (
                     <CardItem
                        item={item}
                        key={item.fields.id}
                     />
                  )
               }) 
            }</ul>
         :
         <div className={categories["nothing-list"]}>
            <p>
               Nenhum item disponível
            </p>
         </div>
            }

      </section>
   )
}