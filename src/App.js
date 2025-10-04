import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./component/carritoagg";
import Tienda from "./component/tienda";
import Productos from "./component/crud_produc";
import Login from "./component/login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./component/firebase"; 

import "./App.css";
import "./login.css";

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <p className="cargando">Cargando...</p>;
  }

  return (
    <>
      <header className="header">
        <h1>ALGO CHIC</h1>
      </header>

      

      <main className="contenido">
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Tienda />} />
              <Route path="/admin" element={user ? <Productos /> : <Login setUser={setUser} />}/>
            </Routes>
          </Router>
        </CartProvider>
      </main>

      <footer>
        <h2>Agostina Jimenez - Desarrollo web</h2>
      </footer>
    </>
  );
}

export default App;
