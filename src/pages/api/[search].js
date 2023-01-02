import { fetcher } from '../../services/clientContentful';

export default async function handler(req, res){
   const { query } = req;

   const data = await fetcher({
      content_type: 'content',
      select: 'fields.title,fields.poster,fields.url,fields.releaseDate,fields.votes,fields.id,fields.informations,fields.mode',
      'fields.title[match]': query.search,
      order: '-fields.popularity,-fields.releaseDate',
      limit: 25
   })

   res.status(200).json(data);
}