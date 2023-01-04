import mdetails from './mdetails.module.css';

export function MoreDetails({ item, seasonSelected }){

    const formatDate = (date) => {
        if(date){
            const dateFull = new Date(date);
            return Intl.DateTimeFormat("pt-BR").format(dateFull);
        }

        return 'desconhecido'
    }

    const formatValue = (value) => Intl.NumberFormat('en-US', {
        style: 'currency', 
        currency: 'USD'
    }).format(value);

    function listDivisor(list, title, limit = 4){
        const parag = list.map((item, index) => {
            const prop = typeof item == 'object' ? item[title] : item 
            return index < limit ? !index ? prop : ' - '  + prop : ''
        })

        return parag
    }

    const date = seasonSelected ? seasonSelected.air_date : (item.first_air_date || item.release_date)

    function translateStatus(status){
        switch(status){
            case 'Pilot':
                return 'Piloto'
            case 'In Production':
                return 'Em Produção'
            case 'Returning Series':
                return 'Série Retomada'
            case 'Cancelled':
                return 'Cancelada'
            case 'Ended':
                return 'Finalizada'
            default:
                return 'Indefinida'
        }
    }

    const noSelectedSeason =  seasonSelected || item.title

    return (
        <>
        <section className={mdetails.container}>

            <h3>Detalhes</h3>
            <ul className={mdetails.infos}>
                {
                    item.tagline ? <li>
                        <p>{item?.tagline}</p>
                        <p>Tagline</p>
                    </li> : ''
                }
                <li>
                    <p>{item.original_name || item.original_title}</p>
                    <p>Título original</p>
                </li>
                <li>
                    <p>{formatDate(date)}</p>
                    <p>Lançamento</p>
                </li>
                {
                    seasonSelected ? <li>
                        <p>{seasonSelected?.episode_count}</p>
                        <p>Episódios</p>
                    </li> : ''
                }
                {
                    item.revenue ? <li>
                        <p>{formatValue(item?.revenue)}</p>
                        <p>Receita</p>
                    </li> : ''
                }
                
                {
                    item.networks ? <li>
                        <p>{listDivisor(item.networks, 'name', 3)}</p>
                        <p>Redes</p>
                    </li> : ''
                }

                {
                    item.created_by?.length ? <li>
                        <p>{listDivisor(item.created_by, 'name')}</p>
                        <p>Criado por</p>
                    </li> : ''
                }

                {
                    item.in_production !== undefined ? <li>
                        <p>{item.in_production ? 'Sim' : 'Não'}</p>
                        <p>Em produção</p>
                    </li> : ''
                }
                {
                    item.name && item.status ? <li>
                        <p>{translateStatus(item.status)}</p>
                        <p>Status</p>
                    </li> : ''
                }
                {
                    item.budget ? <li>
                        <p>{formatValue(item?.budget)}</p>
                        <p>Orçamento</p>
                    </li> : ''
                }
                <li>
                    <p>{
                        listDivisor(item.production_companies, 'name', 3) 
                    }</p>
                    <p>Produção</p>
                </li>

            </ul>
        </section>
        </>
    )

}