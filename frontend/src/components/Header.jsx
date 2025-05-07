import jukeboxLogo from "../assets/jukebox-logo.png";
import heartIcon from "../assets/icons/heart.png";
import cartIcon from "../assets/icons/shopping-cart.png";
import userIcon from "../assets/icons/circle-user.png";
import "../css/header.css";
import "../css/main.css";

function Header() {
    return (
        <>
        <div className="top-notification">
            We guarantee you'll be delighted with your purchase and its condition.
        </div>
        <header className="header">
            <div className="logo">
                <a href="#"><img src={jukeboxLogo} alt="Jukebox Logo" /></a>
            </div>
            <nav className="nav">
                <a href="#">Home</a>
                <a href="#">CD</a>
                <a href="#">Vinyl</a>
                <a href="#">Accessories</a>
                <a href="#">Genres</a>
                <a href="#">About</a>
            </nav>
            <div className="header-icons">
                <a className="icon" href="#"><img src={heartIcon} alt="Favourites" /></a>
                <a className="icon" href="#"><img src={cartIcon} alt="Cart" /></a>
                <a className="icon" href="#"><img src={userIcon} alt="User Page" /></a>
            </div>
        </header>
        </>
    );
}

export default Header;