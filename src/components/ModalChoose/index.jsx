import modal from './modal.module.css';
import Close from '../../assets/close.svg';

export function ModalChoose({
        children, hdTitle, opacity, 
        watchModal, closeModal
    }){
        function clickOutModal(e){
            if(e.target === e.currentTarget){
                closeModal(false);
            }
        }

        return (
            <section 
                aria-hidden={!watchModal}
                className={modal.container}
                style={{
                    display: watchModal ? 'flex' : 'none',
                    backgroundColor: `rgba(0,0,0,${opacity})`
                }}
                onClick={clickOutModal}
            >
                <div className={modal.content}>
                    <div className={modal.header}>
                        <p>{hdTitle}</p>
                        
                        <div>
                            <Close 
                                onClick={() => closeModal(false)}
                            />
                        </div>
                    </div>

                    {children}

                </div>
            </section>
    )
}