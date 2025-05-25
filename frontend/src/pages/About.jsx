import Footer from '../components/Footer';
import Header from '../components/Header'
import "../css/main.css"
import "../css/about.css"
import icmcLogo from "../assets/icmc-logo.png"

function About () {
    return (
        <>
            <Header/>

            <div className="h1"><h1 className="poppins-extrabold">About JUKEBOX</h1></div>
            
            <div className="about-description">
                <p className="poppins-regular">
                    JUKEBOX is an e-commerce site created by <strong>Eduardo Freire, Laura Camargos and Sandy Dutra</strong>.
                    <br></br>
                    It's a project for the discipline of Introduction to Web Development (SCC0219), lectured by professor Dilvan de Abreu Moreira, PhD.
                </p>
            </div>
            <div className="icmc-logo">
                <img src={icmcLogo} alt="" />
            </div>

            <Footer/>
        </>
    )
}

export default About