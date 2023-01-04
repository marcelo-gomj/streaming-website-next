import styles from './header.module.css';

export function TagList({tags}){
    function traslateTag(tag){
        switch(tag){
            case 'Action & Adventure':
                return 'Ação e Aventura';
            case 'Sci-Fi & Fantasy':
                return 'Ficção Científica'
            default:
                return tag;
        }
    }

    return (
        <ul className={styles.tag}>
            { 
                tags.map((tag, index) => index < 3 ? 
                    <li key={index}>{traslateTag(tag.name)}</li> 
                    : ''
                ) 
            }
        </ul>
    )
}