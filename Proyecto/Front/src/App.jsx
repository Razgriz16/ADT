import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Terreno from './Terreno/Terreno'
import Supervisor from "./Supervisor/Supervisor"
import Subgerente from "./Subgerente/Subgerente.jsx"
import Gerente from "./Gerente/Gerente"


function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path= '/register' element={<Signup />}></Route>
        <Route path= '/Login' element={<Login />}></Route> 
        <Route path= '/Terreno' element={<Terreno />}></Route> 
        <Route path= '/Supervisor' element={<Supervisor />}></Route>
        <Route path= '/Subgerente' element={<Subgerente/>}></Route>
        <Route path= '/Gerente' element={<Gerente />}></Route>

      </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
