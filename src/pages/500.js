import { LayoutError } from '../components/LayoutError';

export default function Page500(){
    return (
        <LayoutError message={"500 - Ocorreu um erro no lado do servidor"} />
    )
}