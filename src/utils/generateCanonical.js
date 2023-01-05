export function generateCanonicalUrl(router){
    const url = process.env.NEXT_PUBLIC_URL_BASE;
    const canonicalUrl = (url + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
    return canonicalUrl;
}
