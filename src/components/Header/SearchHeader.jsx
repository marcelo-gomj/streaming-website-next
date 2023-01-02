import { useState, useRef, useEffect } from 'react';

import { ListResults } from './ListResults.jsx';

import search from './search.module.css';
import Router from 'next/router';
import Search from '../../assets/search.svg';
import Close from '../../assets/close.svg';



export function SearchHeader() {
   const [isSearch, setIsSearch] = useState(false);
   const [results, setResults] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const timeRef = useRef(null);
   const inputRef = useRef(null);

   useEffect(() => {
      function clickSeach() {	
         setIsSearch(false);
         setResults([]);
      }

      Router.events.on("routeChangeComplete", clickSeach );

      return () => Router.events.off('routeChangeComplete', clickSeach);

  }, [Router.events]);

   useEffect(() => {
      if(isSearch){
         inputRef.current.focus();

      }else{

         if(inputRef.current.value.trim().length){
            inputRef.current.value = '';
            setResults([]);
         }
      }
   }, [isSearch])

   async function getResultsList(input) {

      const res = await fetch('/api/search/' + input);
      const response = await res.json();

      setResults(response.items);
      setIsLoading(false);
   }

   function debouceSearch(event) {
      clearTimeout(timeRef.current);
      const value = event.target.value;
      
      if(value.length > 1){
         timeRef.current = setTimeout(() => {
            setIsLoading(true)
            const formatInput = value.trim();
            getResultsList(formatInput);

         }, 800);
      }else{
         setResults([]);
      }
   }

   let isBarActive, openBar = ''

   if (isSearch) {
      isBarActive = search['search-active'];
      openBar = search['open-search-bar'];
   }

   function checkNotFound(){
      if(inputRef.current){
         const inputValue = inputRef.current.value.trim()

         if(inputValue.length > 1 && !isLoading){
            return (
               <div className={search['empty-results']}>
                  <p>Nenhum resultado para : <span>{inputValue}</span></p>
               </div>
            )
         }
      }

      return '';
   }

   return (
      <>
         <div
            className={`${search['container']} ${isBarActive}`}
         >
            <div className={`${search['content-wrapper']}`}>
               <form className={`${search['form-bar']} ${openBar}`}>
                  <span className={search['label-search']}>
                     <Search />
                  </span>

                  <input
                     type="text"
                     spellCheck={false}
                     onChange={debouceSearch}
                     placeholder={'Digite algo para pesquisar'}
                     ref={inputRef}
                  />
               </form>
               
               <div className={search['loading-bar']}>
                   { isLoading && <div></div>}
               </div>

               { 
                  results.length ? <ListResults results={results} /> : checkNotFound()
               }

            </div>
         </div>

         <button
            className={search['button-search']}
            onClick={() => {
               setIsSearch(search => !search);
            }}
         >
            {isSearch ? <Close /> : <Search />}
            <p>{isSearch ? 'Fechar' : 'Pesquisar'} </p>
         </button>
      </>
   )
}