// reduce others nations rating 
function getRating(item) {
   const nations = item.content_ratings || item.release_dates;
   let brRating;
   nations.results.map(nation => {
      if (nation.iso_3166_1 === 'BR') {
         brRating = nation.rating || nation.release_dates[0].certification;
      }
   })

   return brRating || 'nenhuma';
}

// reduce list of trailers
function reduceTrailerList( videos ) {
   if(videos?.results.length){
      videos.results = [videos.results[0]]
   }

   return videos
}

export function reduceContent(contents) {
   const removes = ['adult', 'release_dates', 'content_ratings',
      'homepage', 'languages', 'last_episode_to_air',
      'origin_country', 'spoken_languages', 'imdb_id', 'belongs_to_collection',
      'original_language'];

   const finalContent = Object.keys(contents)
      .reduce((content, item) => {
         if (removes.includes(item)) {
            return content;
         }

         content[item] = contents[item];

         return content
      }, {})

   finalContent.rating = getRating(contents);
   finalContent.videos = reduceTrailerList(contents?.videos);

   return finalContent;
}