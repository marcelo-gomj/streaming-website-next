import { ImageTmdb } from "../ImageTmdb";

import banner from "./banner.module.css";

export function CoverItems({ items, active, select }){
   return (
      <div className={banner['banner-covers']}>
         <ul className={banner['covers-container']}>
            {
               items.map((item, id) => {
                  return (
                     <li 
                        className={banner['banner-cover']}
                        style={active === id ? { outlineColor: 'white', opacity: '1' } : {}}
                        key={item.fields.id}
                        onClick={() => select(id)}
                        tabIndex={0} 
                     >
                        <ImageTmdb 
                           path={item.fields.poster} 
                           type={'poster'} 
                           priority={true} 
                           alt={''} 
                        />
                     </li>
                  )
               })
            }
         </ul>
      </div>
   )
}
