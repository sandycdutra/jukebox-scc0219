import Footer from '../components/Footer';
import Header from '../components/Header'
import ProductGrid from '../components/ProductGrid'

function Home() {
    
    return (
        <>
            <Header/>
            
            <h1 className="h1">check our products</h1>
            <ProductGrid/>

            <Footer/>
        </>
    )
}

export default Home