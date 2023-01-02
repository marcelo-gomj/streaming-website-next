import { useState, useEffect } from 'react';
import Link from 'next/link';

import rows from './row.module.css';

import ArrowLeft from '../../assets/arrow-r.svg';
import ArrowRight from '../../assets/arrow-r.svg';

function debounce(fn, ms) {
   let timer;
   return function ( ...args) {
      const context = this;

      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
         timer = null
         fn.apply(context, args)
      }, ms)
   };
}

export function RowContainer({ length, title, more, screens, children }) {
   const [row, setRow] = useState({ step: 0, append: 0, limit: 0 });
   const [state, setState] = useState({ value: 0, frame: 0 });
   const [resize, setResize] = useState(true);

   const responsive = (columns) => {
      if (state.frame) setState({ value: 0, frame: 0 })

      const rest = length % columns;

      setRow({
         step: 50,
         append: rest ? (50 / columns) * rest : 0,
         limit: (Math.trunc(length / columns) - 2)
      })

      setResize(false)
   }

   useEffect(() => { 
      if (resize) {
         const innerWidth = window.innerWidth;
         const itemsByScreens = Object.entries(screens);
         
         let screen;
         itemsByScreens.map(([key, value]) => {
            if(!screen && innerWidth <= Number(key)){
               screen = value;
            }
         })

         responsive(screen || screens.default)
      }
   }, [resize])

   useEffect(() => {
      const debouncedHandleResize = debounce(() => setResize(true), 1000);
      window.addEventListener('resize', debouncedHandleResize);
      return () => {
         window.removeEventListener('resize', debouncedHandleResize);
      }
   })

   const setLimit = () => row.limit + (row.append ? 1 : 0) > state.frame;

   const mutateRowState = (add, isAppend) => {
      const step = isAppend ? row.step : row.append;

      setState(({ value, frame }) => ({
         "value": add ? value + step : value - step,
         "frame": add ? frame + 1 : frame - 1
      }))
   }

   return (
      <section className={rows.container}>
         <header>
            <h2>{title}</h2>
            
            { more && <Link href={more} className={rows['header-more']}
               >ver todos
            </Link> }

         </header>

         <div className={rows.rowContainer}>
            <div className={rows.controllers}>
               <button
                  onClick={() => {
                     if (state.frame) {
                        mutateRowState(false, row.limit >= state.frame);
                     }
                  }}
                  className={`${rows.button} ${rows.left}`}
                  style={{ visibility: state.frame ? 'visible' : 'hidden' }}
               >
                  <ArrowLeft />
               </button>

               <button
                  onClick={() => {
                     mutateRowState(true, row.limit > state.frame);
                  }}
                  className={`${rows.button} ${rows.right}`}
                  style={{ visibility: setLimit() ? 'visible' : 'hidden' }}
               >
                  <ArrowRight />
               </button>
            </div>

            <div className={rows.wrapper}>
               <div
                  className={`${rows['items-container']} ${row.step ? rows.loadedItems : ''}`}
                  style={{ transform: `translateX(-${state.value}%)`}}
               >
                  { children }
               </div>
            </div>
         </div>
      </section>
   )
}