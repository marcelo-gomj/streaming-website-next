import { useEffect, useState } from 'react';
import Link from 'next/link';
import header from './header.module.css';

import { SearchHeader } from './SearchHeader';

export function Header() {
   const [headerColor, setHeaderColor] = useState(false);
   const [isMobileMenu, setMobileMenu] = useState(false);

  const classLines = ['ham-first', 'ham-second', 'ham-third'];

   useEffect(() => {
      function handleColorHeader() {
         const isScrolled = !!window.pageYOffset;
         setHeaderColor(isScrolled);
      }

      window.addEventListener('scroll', handleColorHeader);
      return () => window.removeEventListener('scroll', handleColorHeader)
   }, []);

   let mobileMenu = '';
   if(isMobileMenu) mobileMenu =  header['mobile-menu']

   return (
      <header
         className={header['container']}
         style={headerColor ? { background: 'black' } : {}}
      >
         <div className={header['wrapper-header']}>
            <nav className={`${header['main-menu']} ${mobileMenu}`} aria-label="Main menu">
               <Link href={'/'}>Inicio</Link>
               <Link href={'/filmes'}>Filmes</Link>
               <Link href={'/series'}>Séries</Link>
               <div className={header['more-container']}>
                  <span tabIndex={0}>Outros</span>

                  <ul className={header['more-menu']}
                     tabIndex={0}
                  >
                     <Link href={'/animes'}>Animes</Link>
                     <Link href={'/animacoes'}>Animações</Link>
                     <Link href={'/desenhos'}>Desenhos</Link>
                     <Link href={'/terms'}>Termos</Link>
                  </ul>
               </div>
            </nav>

            <div
               className={`${header['hamburger-menu']}`}
               aria-hidden={isMobileMenu ? true : false}
               onClick={() => setMobileMenu(!isMobileMenu)}
               tabIndex={0}
            >{
               classLines.map((line, index) => <div key={index} className={isMobileMenu ? header[line] : ''}></div>)
            }</div>

            <div
               className={header['logo-centered']}
               role={'logo'}
            >STREAMING WEBSITE</div>

            <SearchHeader setHeader={setHeaderColor} />
         </div>
      </header>
   )
}