import { useRouter } from "next/router";

export function GenerateCanonicalUrl(){
   const router = useRouter();

   const url = process.env.NEXT_PUBLIC_URL_BASE;
   const canonicalUrl = (url + (router.asPath === "/" ? "": router.asPath)).split("?")[0];
   return canonicalUrl;
}