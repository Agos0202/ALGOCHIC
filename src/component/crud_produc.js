import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import axios from "axios";
import "../productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    tipo: "",
    imagen: "",
  });
  const [editando, setEditando] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  const productosRef = collection(db, "productos");

  
  const obtenerProductos = useCallback(async () => {
    const q = query(productosRef, orderBy("fecha", "desc"));
    const snapshot = await getDocs(q);
    setProductos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }, [productosRef]);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  const subirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "algochic");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dzbexisoq/image/upload",
      formData
    );

    setNuevo({ ...nuevo, imagen: res.data.secure_url });
  };

  const agregarProducto = async () => {
    if (!nuevo.nombre || !nuevo.precio || !nuevo.imagen)
      return alert("Faltan campos");

    await addDoc(productosRef, {
      ...nuevo,
      fecha: new Date(),
    });

    setNuevo({ nombre: "", descripcion: "", precio: "", tipo: "", imagen: "" });
    obtenerProductos();
  };

  const actualizarProducto = async (id) => {
    const prodRef = doc(db, "productos", id);
    await updateDoc(prodRef, {
      nombre: nuevo.nombre,
      descripcion: nuevo.descripcion,
      precio: nuevo.precio,
      tipo: nuevo.tipo,
      imagen: nuevo.imagen,
    });
    setEditando(null);
    setNuevo({ nombre: "", descripcion: "", precio: "", tipo: "", imagen: "" });
    obtenerProductos();
  };

  const eliminarProducto = async (id) => {
    await deleteDoc(doc(db, "productos", id));
    obtenerProductos();
  };

  const seleccionarFiltro = (categoria) => {
    setFiltro(categoria);
    setSidebarOpen(false);
  };

  return (
    <div className="container">
      <button
        className={`menu-btn ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => seleccionarFiltro("todos")}>TODO</li>
          <li onClick={() => seleccionarFiltro("pulseras")}>PULSERAS</li>
          <li onClick={() => seleccionarFiltro("aros")}>AROS</li>
          <li onClick={() => seleccionarFiltro("cadenas")}>CADENAS</li>
          <li onClick={() => seleccionarFiltro("anillos")}>ANILLOS</li>
          <li onClick={() => seleccionarFiltro("otros")}>OTROS</li>
        </ul>
      </div>

      <div className="main">
        <h2>PRODUCTOS</h2>

        <div className="form">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) =>
              setNuevo({ ...nuevo, nombre: e.target.value.toUpperCase() })
            }
          />
          <input
            type="text"
            placeholder="Descripcion"
            value={nuevo.descripcion}
            onChange={(e) =>
              setNuevo({ ...nuevo, descripcion: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevo.precio}
            onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
          />

          <select
            value={nuevo.tipo}
            onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
          >
            <option value="">Selecciona un tipo</option>
            <option value="pulseras">Pulseras</option>
            <option value="aros">Aros</option>
            <option value="cadenas">Cadenas</option>
            <option value="anillos">Anillos</option>
            <option value="otros">Otros</option>
          </select>

          <input type="file" onChange={subirImagen} />
          {nuevo.imagen && <img src={nuevo.imagen} alt="preview" width={80} />}

          {editando ? (
            <button onClick={() => actualizarProducto(editando)}>
              ACTUALIZAR
            </button>
          ) : (
            <button onClick={agregarProducto}>AGREGAR</button>
          )}
        </div>

        <hr />

        <div className="grid">
          {productos
            .filter((p) => filtro === "todos" || p.tipo === filtro)
            .map((p) => (
              <div key={p.id} className="card">
                <img src={p.imagen} alt={p.nombre} />
                <h4>{p.nombre}</h4>
                <p>{p.descripcion}</p>
                <p>
                  <b>${p.precio}</b>
                </p>
                <p>
                  <i>{p.tipo}</i>
                </p>
                <button
                  onClick={() => {
                    setEditando(p.id);
                    setNuevo(p);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Productos;
