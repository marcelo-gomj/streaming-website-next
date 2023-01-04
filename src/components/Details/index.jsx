import details from "./details.module.css";

export function ContentDetails({ item }) {
   function setColorCert(certi) {
      const tracks = ['L', 10, 12, 14, 16, 18];
      let color = '';
      tracks.map((track, index) => {
         if (certi == track) {
            color = 'track-' + index;
         }
      })

      return color;
   }

   function getStringList(array) {
      if (!!array) {
         return array.map((lang, index) => {
            return !index ? lang : (index < 4) ? ' / ' + lang : ''
         })

      } else return ['indisponível']
   }

   function convertLangCode(lang) {
      switch (lang) {
         case 'pt-BR':
            return 'português';
         case 'en-US':
            return 'Inglês';
         default:
            return lang
      }
   }

   function mapLanguagesAudio(languages){
      return languages.map((lang, index) => !index ? convertLangCode(lang) : '/' + convertLangCode(lang))
   }

   const date = item.selectedSeason?.air_date || (item.first_air_date || item.release_date);
   const noSelectedSeason = item.selectedSeason || item.title;

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

      </ul>
   )
}