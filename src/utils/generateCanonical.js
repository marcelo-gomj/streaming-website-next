import Router from 'next/router';

export function generateCanonicalUrl(){
    const url = process.env.NEXT_PUBLIC_URL_BASE;
    const canonicalUrl = (url + (Router.asPath === "/" ? "": Router.asPath)).split("?")[0];
    return canonicalUrl;
}
