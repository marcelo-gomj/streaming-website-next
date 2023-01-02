import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useContext } from 'react';
import { SizeScreen } from '../../pages/_app';

export function ImageTmdb ({ type, path, alt, priority = false}){
    const [url, setUrl ] = useState('');
    const sizes = useContext(SizeScreen);

    useEffect(() => {
        if(sizes) setUrl(`https://image.tmdb.org/t/p/${'w' + sizes[type] + path}`);

    }, [sizes, path])

    return (
        <>
            {url && <Image
                src={url}
                fill
                sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw"
                quality={90}
                alt={alt}
                priority={priority}
            />}
        </>
    )
}