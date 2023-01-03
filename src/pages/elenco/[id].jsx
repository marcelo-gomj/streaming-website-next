import Head from 'next/head';
import { useMemo } from 'react';

import { PaginationContent } from '../../services/PaginationContent';
import { fetcherTmdb } from '../../services/tmdb';
import { fetcher } from '../../services/clientContentful';

import { ImageTmdb } from '../../components/ImageTmdb';
import { PaginationItems } from '../../components/Pagination';
import { ControllersPagination } from '../../components/Pagination/PaginationControllers';
import { CastSection } from '../../components/CastSection';

import cast from '../../styles/cast.module.css';
import Actor from '../../assets/no-actor.svg';

export default function ElencoPage({
   totalPages,
   currentFilter,
   currentPage,
   list,
   person,
   credits,
   relationID
}) {
   const overview = useMemo(() => {
      const { biography } = person;
      
      if(biography){
         const splitedText = biography.split('')
         splitedText.length = 157;
         return splitedText.join('') + '...'
      }
   }, [person]);
   
   const isMen = person.gender === 2;
   
   const twoDigits = (number) => {
      const digit = '' + number;
      return digit.length === 1 ? ('0' + number) : digit;
   }

   function calcYearOlds(){
      const date = new Date();
      if(person.birthday){
         const dateNow = date.getFullYear() + twoDigits(date.getMonth()) + twoDigits(date.getDate());
         const calcYear = String(Number(dateNow) - Number(person.birthday.split('-').join('')));
      
         return calcYear.slice(0, (calcYear.length === 7 ? 3 : 2))  
      }

      return;
   }

   const checkYearOld = calcYearOlds();
   const yearsOld = checkYearOld ? checkYearOld + ' anos' : '';
   const formatDate = (date) => {
      if(!date) return 'indisponível';
      return date.split('-').reverse().join('/'); 
   }

   return (
      <>
         <Head>
            <title>{person.name} - perfil</title>
            <meta description={overview} />
         </Head>

         <main>
            <section className={cast["profile-header"]}>
               <div className={cast["profile-image"]}>
                 {person.profile_path ? 
                     <ImageTmdb 
                        type={'poster'}
                        path={person.profile_path} 
                        alt={`imagem ${isMen ? 'do' : 'da'} ` + person.name} 
                     /> :
                     
                     <Actor />
                     
                  }
               </div>

               <div className={cast["profile-description"]}>
                  <div>
                     <h2>{person.name}</h2>
                     <p>{person.biography || "Biografia indisponível."}</p>
                  </div>

                  <ul className={cast["profile-properties"]}>
                     {!person.deathday && <li>
                        {yearsOld || 'indisponível'} 
                        <span>idade</span>
                     </li>}
                    
                     {person.place_of_birth &&  <li>
                        {person.place_of_birth}
                        <span>local de nascimento</span>
                     </li>}
                    
                     <li>
                        {formatDate(person.birthday)}
                        <span>data de nascimento</span>
                     </li>

                     {person.deathday && <li>
                       {formatDate(person.deathday)}
                        <span>falecimento</span>
                     </li>}
                  </ul>
               </div>
            </section>

            <section className={cast["section-header"]}>
               <h3>Filmografia disponível</h3>
            </section>
            
            <PaginationItems list={list} />
            
            <ControllersPagination 
               totalPages={totalPages}
               currentPage={currentPage}
               currentFilter={currentFilter}
            />

            <CastSection castItems={credits} itemID={relationID} />

         </main>
      </>
   )
}

export async function getServerSideProps({ params, query }) {
   const { id } = params;
   const { rel } = query;
   const actorID = id.split('-').slice(-1)[0];

   const select = [
      'title', 'poster', 'backdrop', 'id', 'url', 'mode',
      'informations', 'releaseDate', 'certification'
   ].map(item => 'fields.' + item).join(',');

   const cast = {
      select,
      "fields.castId": actorID
   }

   const data = await PaginationContent(query, params, cast);
   const person = await fetcherTmdb('person', actorID, false, 3);
   const relations = await fetcher({
      content_type: 'content',
      "fields.id" : rel,
      select: 'fields.id,fields.tmdb',
   })
   const credits = relations.items[0].fields.tmdb.credits.filter(item => item.id !== Number(actorID))
   const relationID = relations.items[0].fields.id

   return {
      props: {
         ...data,
         person,
         credits,
         relationID
      }
   }
}

