import modal from './modal.module.css';
import CloseIcon from '../../assets/close.svg';

export function Modal({children, isModal, setModal}) {
    const showModal = {display : isModal ? 'flex' : 'none'};
    
    function handleModalClose(e){
        if(e.target === e.currentTarget){
            setModal(false);
        }
    }

    return (
        <section 
            className={modal.container}
            style={showModal}
            onClick={handleModalClose}
            aria-hidden={!isModal}
        >
            <button 
                className={modal.close}
                onClick={() => setModal(false)}
            >
                <CloseIcon />
            </button>

            {isModal ? children : ''}
        
        </section>
    )
}