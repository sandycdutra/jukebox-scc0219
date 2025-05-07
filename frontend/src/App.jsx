import { useState } from 'react'
// import jukeboxLogo from './assets/jukebox_logo.png'
import './css/App.css'
import { Routes, Route } from 'react-router-dom'
// import Home from "./pages/Home"
import Home from "./pages/Home"

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
        <div>
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                </Routes>
            </main>
            
        </div>
        </>
    )
}

export default App
