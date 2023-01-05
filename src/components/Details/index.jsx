import { useCallback } from 'react';
import details from "./details.module.css";

export function ContentDetails({ item, seasonSelected }) {
   const setColorCert = useCallback((certi) => {
      const tracks = ['L', 10, 12, 14, 16, 18];
      let color = '';

      tracks.map((track, index) => {
         if (certi == track) {
            color = 'track-' + index;
         }
      })

      return color;
   })

   const date = seasonSelected?.air_date || (item.first_air_date || item.release_date);

   console.log(item)
   return (
      <ul className={details.container}>
         <li tabIndex={0}>
            <p>{(item.runtime || item.episode_run_time[0])} min</p>
            <p>Duração</p>
         </li>
         
         <li tabIndex={0}>
            <p>{item.vote_average.toFixed(1)}</p>
            <p>Avaliação</p>
         </li>
         
         <li tabIndex={0}>
            <div>
               <div className={details[`${setColorCert(item.rating)}`]}>
                  {item.rating}
               </div>
            </div>
            <p>Classificação</p>
         </li>

         <li tabIndex={0}>
            <p>{date?.slice(0, 4) || 'desconhecido'}</p>
            <p>Ano</p>
         </li>
         {item.title && (
            <>
               <li>
                  <p></p>
                  <p></p>
               </li>
               <li>
                  <p></p>
                  <p></p>
               </li>
            </>
         )}


         {
            item.name && (!seasonSelected) && (
               <>
                  <li>
                     <p>{item.number_of_seasons}</p>
                     <p>Temporadas</p>
                  </li>
                  <li>
                     <p>{item.in_production ? 'Sim' : 'Não'}</p>
                     <p>Em produção</p>
                  </li>
               </>
            )
         }

         {
            seasonSelected && (
               <>
                  <li>
                     <p>{seasonSelected.season_number}</p>
                     <p>Temporada</p>
                  </li>
                  <li>
                     <p>{seasonSelected.episode_count}</p>
                     <p>Episódios</p>
                  </li>
               </>
            )
         }
      </ul>
   )
}