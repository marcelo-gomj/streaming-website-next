
import { fetcherTmdb } from "../../services/tmdb";

export default async function handler(req, res){
   const { query } = req;
   const { status, json } = res;
   const { id, type, lang } = query;

   let data;

   if(lang){
      data  = await fetcherTmdb(type, id, true, 3, '', 'en-US');
   }else{
      data = await fetcherTmdb(type, id, true, 3);
   }

   status(200)
   json(data)
}