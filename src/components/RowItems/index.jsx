import { memo } from 'react';
import row from './row.module.css';
import { CardItem } from '../CardItem';

export function ListItems({ items }) {
   return (
      <ul className={row.items}>
         {items.map((item) => {
            return (
               <CardItem key={item.fields.id} item={item} />
            )
         })}
      </ul>
   )
}

export const RowItems = memo(ListItems);