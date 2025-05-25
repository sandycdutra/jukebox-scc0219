import Footer from '../components/Footer';
import Header from '../components/Header'
import ProductGrid from '../components/ProductGrid'
import Sidebar from '../components/Sidebar';
import "../css/main.css"
import '../css/sidebar.css'

function Vinyl () {
    return (
        <>
            <Header/>

            <div class="layout">
                <aside class="sidebar"> 
                    <h1>Vinyl</h1>
                    <Sidebar/>               
                </aside>

                <div class="content">
                <ProductGrid/>
                </div>
            </div>

            <Footer/>
        </>
    )
}

export default Vinyl