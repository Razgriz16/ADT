import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Terreno from './Terreno/Terreno'
import Supervisor from "./Supervisor/Supervisor"
import Subgerente from "./Subgerente/Subgerente.jsx"
import Gerente from "./Gerente/Gerente"
import ProtectedRoute from './ProtectedRoute';


function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route
          path="/supervisor"
          element={
            <ProtectedRoute requiredRole="Supervisor">
              <Supervisor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/terreno"
          element={
            <ProtectedRoute requiredRole="Terreno">
              <Terreno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subgerente"
          element={
            <ProtectedRoute requiredRole="SubGerente">
              <Subgerente />
            </ProtectedRoute>
          }
        />
        <Route path= '/register' element={<Signup />}></Route>
        <Route path= '/Login' element={<Login />}></Route> 
        <Route path= '/Gerente' element={<Gerente />}></Route>

      </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
