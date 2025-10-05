import React, { useState } from "react";
import { useCart } from "./carritoagg";
import "../carrito.css";
import bolsa from "./bolsa.png"; // 🛍 tu icono de bolsa

const Carrito = () => {
  const { cart, vaciarCarrito, cambiarCantidad } = useCart();
  const [form, setForm] = useState({ nombre: "", apellido: "", direccion: "" });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Calcular totales
  const total = cart.reduce((acc, p) => acc + p.precio * p.qty, 0);
  const cantidadTotal = cart.reduce((acc, p) => acc + p.qty, 0); // suma de cantidades

  // Enviar pedido por WhatsApp
  const enviarPedido = () => {
    const detalle = cart
      .map((p) => `${p.nombre} x${p.qty} = $${p.precio * p.qty}`)
      .join("%0A");

    const mensaje = `🛍 *Nuevo Pedido* 🛍%0A${detalle}%0A%0A` +
      `Nombre: ${form.nombre}%0A` +
      `Apellido: ${form.apellido}%0A` +
      `Dirección: ${form.direccion}%0A` +
      `Total: $${total}`;

    const numero = "5493814132640"; // ⚡ cambia por tu número
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");

    vaciarCarrito();
    setForm({ nombre: "", apellido: "", direccion: "" });
    setMostrarFormulario(false);
    setSidebarAbierto(false);
  };

  return (
    <>
      {/* 🛍 Botón con icono de bolsa y badge */}
      <button className="btn-bolsa" onClick={() => setSidebarAbierto(true)}>
        <div className="icono-bolsa">
          <img src={bolsa} alt="Carrito" />
        </div>
        {cantidadTotal > 0 && <span className="badge">{cantidadTotal}</span>}
      </button>

      {/* Overlay oscuro */}
      {sidebarAbierto && (
        <div
          className="carrito-overlay"
          onClick={() => setSidebarAbierto(false)}
        ></div>
      )}

      {/* Sidebar del carrito */}
      <div className={`carrito-sidebar ${sidebarAbierto ? "open" : ""}`}>
        <h3 className="carrito-text">MI PEDIDO</h3>

        {cart.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px", fontSize:"30px" }}>
            No hay productos agregados aún.
          </p>
        ) : (
          <>
            {cart.map((p) => (
              <div key={p.id} className="carrito-item">
                <span>{p.nombre}</span>
                <div className="cantidad-control">
                  <button onClick={() => cambiarCantidad(p.id, p.qty - 1)}>-</button>
                  <span>{p.qty}</span>
                  <button onClick={() => cambiarCantidad(p.id, p.qty + 1)}>+</button>
                </div>
                <span>${p.precio * p.qty}</span>
              </div>
            ))}

            <p className="total">Total: <b>${total}</b></p>

            {!mostrarFormulario ? (
              <button
                className="btn-finalizar"
                onClick={() => setMostrarFormulario(true)}
              >
                FINALIZAR COMPRA
              </button>
            ) : (
              <div className="formulario-compra">
                <h3 className="carrito-text">DATOS DEL CLIENTE</h3>
                <input
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <input
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                />
                <input
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                />
                <button className="btn-enviar" onClick={enviarPedido}>
                  ENVIAR PEDIDO
                </button>
              </div>
            )}
          </>
        )}

        {/* Botón cerrar */}
        <button
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "8px",
            border: "none",
            background: "#ccc",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize:"20px"
          }}
          onClick={() => setSidebarAbierto(false)}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default Carrito;
