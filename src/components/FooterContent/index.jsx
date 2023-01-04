import { RowItems } from '../RowItems';
import { RowContainer } from '../RowContainer';

export function FooterContent({ recommends, category }) {
   const sizes = {
      "500": 1.5,
      "768": 2,
      "1100": 2.5,
      "default": 3
   }

   return (
      <RowContainer
         key={'Recomendações'}
         title={'Recomendações'}
         length={recommends.length}
         more={'/' + category + '/?page=1&filter=popularity.asc'}
         screens={sizes}
      >
         <RowItems items={recommends} />

      </RowContainer>
   )
}