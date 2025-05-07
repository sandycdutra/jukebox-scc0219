import "../css/footer.css";
import "../css/main.css";

function Footer () {
    return (
        <footer className="footer">
        <div className="footer-content">
            <div className="footer-section">
                <h4>JUKEBOX</h4>
                <a href="#">Home</a>
                <a href="#">Contact us</a>
                <a href="#">Terms and conditions</a>
                <a href="#">Privacy politics</a>
            </div>
            <div className="footer-section">
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
            <div className="footer-section">
                <h4>FOLLOW US</h4>
                <div className="social-icons">
                  <span>📸</span>
                  <span>🎵</span>
                  <span>🐦</span>
                </div>
            </div>
            <div className="footer-section">
                <h4>PAYMENT</h4>
                <div className="payment-icons">
                    <span>💳</span>
                    <span>💳</span>
                    <span>💳</span>
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