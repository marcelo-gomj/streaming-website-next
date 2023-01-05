import Link from 'next/link';
import { useRouter } from 'next/router';

import { ImageTmdb } from '../ImageTmdb';
import list from './season-list.module.css';

export function SeasonsList({seasons, poster}){
    const { asPath } = useRouter();

    function getSeasonList(season){
        const name = `${season.season_number} º Temporada`

        return (
            <>
                <div className={list.poster}>
                    <ImageTmdb 
                        path={(season.poster_path || poster)}
                        type='poster'
                        alt={name + ' poster mini'}
                        priority={true}
                    />
                </div>
                <div>
                    <h3>{name}</h3>
                    <div>
                        <span>{season.air_date?.slice(0, 4)}</span>
                        <span>{` - ${season.episode_count} Episódios`}</span>
                    </div>
                </div>
            </>
        )
    }    
    
    return (
        <ul className={list.container}>
            {
                seasons.reverse().map((season) => {
                    if(season.season_number){
                        return  (
                            <li key={season.season_number}
                                className={list.seasonLink}
                            >
                                <Link  
                                    href={`${asPath}/${season.season_number}-temporada`}
                                >
                                    {getSeasonList(season)}
                                </Link>
                            </li>
                        )
                    }
                })
            }
        </ul>
    )
}