import Footer from '../components/Footer';
import Carousel from '../components/carousel'
import Header from '../components/Header'
import ProductGrid from '../components/ProductGrid'

function Home() {
    
    return (
        <>
            <Header/>
            
            <h1 className="h1">WHAT'S NEW!</h1>
            <Carousel/>
            
            <h1 className="h1">check our products</h1>
            <ProductGrid/>

            <Footer/>
        </>
    )
}

export default Home