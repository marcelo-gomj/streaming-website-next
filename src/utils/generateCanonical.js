import { useRouter } from 'next/router';

export function generateCanonicalUrl(){
    const url = process.env.NEXT_PUBLIC_URL_BASE;
    const router = useRouter();
    const canonicalUrl = (url + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
    return canonicalUrl;
}
