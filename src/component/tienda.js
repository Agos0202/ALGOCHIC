import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useCart } from "./carritoagg";
import Carrito from "./carrito";
import "../tienda.css";

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("todo");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { agregarProducto, cart, cambiarCantidad } = useCart();

  const obtenerProductos = async () => {
    const q = query(collection(db, "productos"), orderBy("fecha", "desc"), limit(60));
    const snapshot = await getDocs(q);
    setProductos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { obtenerProductos(); }, []);

  const productosFiltrados = categoria === "todo" ? productos : productos.filter(p => p.tipo === categoria);

  const seleccionarFiltro = (cat) => {
    setCategoria(cat);
    setSidebarOpen(false);
  };

  return (
    <div className="tienda-container">
      {/* Sidebar */}
      <button className={`menu-btn ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span></span><span></span><span></span>
      </button>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => seleccionarFiltro("todo")}>TODOS</li>
          <li onClick={() => seleccionarFiltro("pulseras")}>PULSERAS</li>
          <li onClick={() => seleccionarFiltro("aros")}>AROS</li>
          <li onClick={() => seleccionarFiltro("cadenas")}>CADENAS</li>
          <li onClick={() => seleccionarFiltro("anillos")}>ANILLOS</li>
          <li onClick={() => seleccionarFiltro("otros")}>OTROS</li>
        </ul>
      </div>

      {/* Grid */}
      <div className="main">
        <div className="grid">
          {productosFiltrados.map(p => {
            const itemEnCarrito = cart.find(c => c.id === p.id);
            return (
              <div key={p.id} className="card">
                <img src={p.imagen} alt={p.nombre} />
                <h4>{p.nombre}</h4>
                <p>{p.descripcion}</p>
                <p><b>${p.precio}</b></p>
                {itemEnCarrito ? (
                  <div className="cantidad-control">
                    <button onClick={() => cambiarCantidad(p.id, itemEnCarrito.qty - 1)}>-</button>
                    <span>{itemEnCarrito.qty}</span>
                    <button onClick={() => cambiarCantidad(p.id, itemEnCarrito.qty + 1)}>+</button>
                  </div>
                ) : (
                  <button className="btn-aggprod" onClick={() => agregarProducto(p)}>AGREGAR</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      
      <Carrito />
    </div>
  );
};

export default Tienda;
