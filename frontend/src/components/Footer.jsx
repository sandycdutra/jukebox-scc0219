import "../css/footer.css";
import "../css/main.css";
import instagramLogo from "../assets/icons/logo-instagram.png";
import tiktokLogo from "../assets/icons/logo-tiktok.png";
import twitterLogo from "../assets/icons/logo-twitter.png";
import mastercardLogo from "../assets/icons/logo-mastercard.png";
import visaLogo from "../assets/icons/logo-visa.png";
import pixLogo from "../assets/icons/logo-pix.png";


function Footer () {
    return (
        <footer className="footer">
        <div className="footer-content">
            <div className="footer-section-text">
                <h4>JUKEBOX</h4>
                <a href="#">Home</a>
                <a href="#">Contact us</a>
                <a href="#">Terms and conditions</a>
                <a href="#">Privacy politics</a>
            </div>
            <div className="footer-section-text">
                <div className="footer-categories">
                    <h4>CATEGORIES</h4>
                    <a href="#">Accessories</a>
                    <a href="#">CDs</a>
                    <a href="#">Vinyl</a>
                    <a href="#">Classical</a>
                    <a href="#">Country</a>
                    <a href="#">Electronic</a>
                    <a href="#">Hip Hop</a>
                    <a href="#">Indie</a>
                    <a href="#">Pop</a>
                    <a href="#">Rap</a>
                    <a href="#">R&B</a>
                    <a href="#">Rock</a>
                </div>
            </div>
            <div className="footer-section-logo">
                <h4>FOLLOW US</h4>
                <div className="social-icons">
                    <a href="https://www.instagram.com" target="_blank"><img src={instagramLogo}  alt="Instagram" /></a>
                    <a href="https://www.tiktok.com/" target="_blank"><img src={tiktokLogo}  alt="TikTok" /></a>
                    <a href="https://x.com/" target="_blank"><img src={twitterLogo}  alt="Instagram" /></a>
                </div>
            </div>
            <div className="footer-section-logo">
                <h4>PAYMENT</h4>
                <div className="payment-icons">
                    <a href="https://www.mastercard.com.br/pt-br.html" target="_blank"><img src={mastercardLogo}  alt="Mastercard" /></a>
                    <a href="https://www.visa.com.br/" target="_blank"><img src={visaLogo}  alt="Visa" /></a>
                    <a href="https://www.bcb.gov.br/estabilidadefinanceira/pix" target="_blank"><img src={pixLogo}  alt="Pix" /></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
          © 2025 JUKEBOX ALL RIGHTS RESERVED
        </div>
    </footer>
    );
}

export default Footer