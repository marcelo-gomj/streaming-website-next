import { ImageTmdb } from '../ImageTmdb';

export function getSeasonList(seasonNumber){
    let matched;
    tmdbSeasons.map((season) => {
        if(season.season_number === seasonNumber){
            const nameSeason = `${seasonNumber} º Temporada`;
            matched = (
                <>
                    <ImageTmdb 
                        path={(season.poster_path || poster)}
                        type='miniCover'
                        alt={nameSeason + ' cover'}
                        priority={true}
                    />
                    
                    <div>
                        <h3>{nameSeason}</h3>
                        <div>
                            <span>{season.air_date?.slice(0, 4)}</span>
                            <span>{` - ${season.episode_count} Episódios`}</span>
                        </div>
                    </div>
                </>
            )
        }
    })

    return matched || 1
}