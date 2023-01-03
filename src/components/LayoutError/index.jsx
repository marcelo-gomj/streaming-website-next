import error from './error.module.css'; 

export function LayoutError({ message }){
    return (
        <main>
            <section className={error.container}>
                <div>
                    <h1 className={error.message}>{message}</h1>
                </div>
            </section>
        </main>
    )
}
