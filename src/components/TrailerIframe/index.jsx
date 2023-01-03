import { useEffect, useState } from 'react';

import trailer from './trailer.module.css';

export function TrailerIframe({ videoID, videosList }) {
   const [pathVideo, setPathVideo] = useState('');

   useEffect(() => {
      (async () => {
         let trailerResults;
         const { id, type } = videoID;

         if (!videosList) {
            const res = await fetch('/api/trailer?type=' + type + '&id=' + id)
            trailerResults = await res.json();            
         } else {
            trailerResults = videosList;
         }

         if (!trailerResults?.results.length) {
            const res = await fetch('/api/trailer?type=' + type + '&id=' + id +"&lang=en");
            trailerResults = await res.json();
         }

         setPathVideo(trailerResults?.results[0]?.key);
      })()

      return () => { }
   }, [])

   return (
      pathVideo ?
         <div
            className={trailer.container}
         >
            <iframe
               src={`https://www.youtube.com/embed/${pathVideo}?modestbranding=1&color=white`}
               allowFullScreen='allowFullScreen'
            >
            </iframe>
         </div>
         :

         <span>Sem Trailer</span>
   )
}