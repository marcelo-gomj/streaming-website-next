const slug = require('slug');

export function parserUrl(url, { id, mode, category }, seasonNumber = ''){
   const modePrefix =  mode[0]
   const identity = '-' + modePrefix + id;
   const details = identity;

   const isSeason = seasonNumber ? `/${seasonNumber}-temporada/` : '';

   return `/${category}/` + slug(url) + details + isSeason;
}
