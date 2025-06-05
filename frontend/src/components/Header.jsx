import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import jukeboxLogo from "../assets/jukebox-logo.png";
import heartIcon from "../assets/icons/heart.png";
import cartIcon from "../assets/icons/shopping-cart.png";
import userIcon from "../assets/icons/circle-user.png"; // Ícone de usuário
import "../css/header.css";
import "../css/main.css";

function Header() {
    const { user, isAuthenticated } = useAuth();

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
                {/* Ícone de Favorites */}
                <Link to="/Favorites" className="icon">
                    <img src={heartIcon} alt="Favorites" />
                </Link>
                {/* Ícone de Cart */}
                <Link to="/Cart" className="icon">
                    <img src={cartIcon} alt="Shopping Cart" />
                </Link>

                {isAuthenticated ? (
                    <Link to="/my-account" className="icon user-status">
                        <img src={userIcon} alt="My Account" />
                    </Link>
                ) : (
                    <Link to="/Login" className="icon user-status">
                        <img src={userIcon} alt="Login" />
                    </Link>
                )}
            </div>
        </header>
        </>
    );
}

export default Header;