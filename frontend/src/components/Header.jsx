import { Link } from 'react-router-dom';

import jukeboxLogo from "../assets/jukebox-logo.png";
import heartIcon from "../assets/icons/heart.png";
import cartIcon from "../assets/icons/shopping-cart.png";
import userIcon from "../assets/icons/circle-user.png";
import "../css/header.css";
import "../css/main.css";
import { use } from 'react';

function Header() {
    return (
        <>
        <div className="top-notification">
            We guarantee you'll be delighted with your purchase and its condition.
        </div>
        <header className="header">
            <div className="logo">
                <Link to="/"><img src={jukeboxLogo} alt="Jukebox Logo" /></Link>
            </div>
            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/CD">CD</Link>
                <Link to="/Vinyl">Vinyl</Link>
                <Link to="/Accessories">Accessories</Link>
                <Link to="/Genres">Genres</Link>
                <Link to="/About">About</Link>
            </nav>
            <div className="header-icons">
                <Link to="/Favorites" className="icon"><img src={heartIcon} alt="Favorites" /></Link>
                <Link to="/Cart" className="icon"><img src={cartIcon} alt="Jukebox Logo" /></Link>
                <Link to="/Login" className="icon"><img src={userIcon} alt="Jukebox Logo" /></Link>
            </div>
        </header>
        </>
    );
}

export default Header;