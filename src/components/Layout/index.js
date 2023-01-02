import { Header } from "../Header";
import { Footer } from "../Footer";

export function Layout({ children }) {
    return (
        <>
            <Header />
            { children }
            <Footer />
        </>
    )
}
