import { useState } from 'react'
// import './css/App.css'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import CD from "./pages/CD"
import Vinyl from "./pages/Vinyl"
import Accessories from './pages/Accessories'
import Genres from './pages/Genres'
import About from './pages/About'
import Favorites from './pages/Favorites'
import Cart from './pages/Cart'
import Login from './pages/Login'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
        <div>
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/CD' element={<CD />} />
                    <Route path='/Vinyl' element={<Vinyl />} />
                    <Route path='/Accessories' element={<Accessories />} />
                    <Route path='/Genres' element={<Genres />} />
                    <Route path='/About' element={<About />} />
                    <Route path='/Favorites' element={<Favorites />} />
                    <Route path='/Cart' element={<Cart />} />
                    <Route path='/Login' element={<Login />} />
                </Routes>
            </main>
        </div>
        </>
    )
}

export default App
