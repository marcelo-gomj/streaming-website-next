import { useEffect, useRef, useState } from 'react';

import { BannerItem } from './BannerItem';
import { CoverItems } from './CoverItems';

import banner from './banner.module.css';

export function BannerHome({ items, isTrailer, getTrailer }) {
   const [heroActive, setHeroActive] = useState(0);
   const [delay, setDelay] = useState(true);
   const TIME_SLIDE = 12000;

   const savedCallback = useRef(null);

   function callback() {
      if (heroActive < 4) {
         setHeroActive((count) => count + 1);
      } else {
         setHeroActive(0);
      }
   }

   useEffect(() => {
      savedCallback.current = callback;
   });

   useEffect(() => {
      let runtime = null;
      function tick() {
         savedCallback.current();
      }

      if (delay && !isTrailer) {
         runtime = setInterval(tick, TIME_SLIDE);
      } else {
         clearInterval(runtime);
      }

      return () => clearInterval(runtime);
   }, [heroActive, delay, isTrailer]);

   return (
      <section className={banner.container}>
         <ul className={banner['banner-items']}>
            {
               items.map((item, index) => {
                  if (item) {
                     return (
                        <BannerItem
                           item={item}
                           key={item.fields.id}
                           show={heroActive === index}
                           pauseBanner={setDelay}
                           getTrailer={getTrailer}
                        />
                     )
                  }
               })
            }
         </ul>

                     
         <CoverItems items={items} active={heroActive} select={setHeroActive} />
      </section>
   )
}