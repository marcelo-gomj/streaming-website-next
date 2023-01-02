// verify the numbers digits
const twoDigits = (number) => {
   if(number === 0) number = 1;

   const digit = '' + number;

   return digit.length === 1 ? ('0' + number) : digit;
}

// function for get videos always updated
// get trailers 1 year next
function getTrailerExplorer() {
   const date = new Date();
   const year = date.getFullYear();
   const month = date.getMonth();
   const day = date.getDay();

   const params = [
      '&sort_by=popularity.desc',
      '&include_adult=false&include_video=true&page=1',
      '&vote_count.gte=0&vote_count.lte=0',
      `&release_date.gte=${`${year}-${twoDigits(month)}-${twoDigits(day)}`}`,
      `&release_date.lte=${year + 1}-07-01`
   ]

   return params.join('')
}

function createUrl(mode, id, trailer) {
   const keyTmdb = process.env.TMDB_API_KEY;
   const API = `api_key=${keyTmdb}`
      , options = [
         mode + '/', id,
         trailer ? '/videos?' : '?',
         API, mode === 'discover' ? getTrailerExplorer(1) : ''
      ]
   return options.join('');
}


export async function fetcherTmdb(mode, id, trailer, version = 4, params, language = 'pt-BR') {
   const url = [
      `https://api.themoviedb.org/${version}/`,
      createUrl(mode, id, trailer),
      '&language=' + (language || 'en-US'),
      params || ''
   ]

   const data = await fetch(url.join(''));

   if (data.ok) {
      return data.json();
   } else {
      console.log('Error');
   }
}
