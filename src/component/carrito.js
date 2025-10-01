import React, { useState } from "react";
import { useCart } from "./carritoagg";
import "../carrito.css";

const Carrito = () => {
  const { cart, vaciarCarrito, cambiarCantidad } = useCart();
  const [form, setForm] = useState({ nombre:"", apellido:"", direccion:"" });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const total = cart.reduce((acc, p) => acc + p.precio * p.qty, 0);

  const enviarPedido = () => {
    const detalle = cart.map(p => `${p.nombre} x${p.qty} = $${p.precio * p.qty}`).join("%0A");
    const mensaje = `*Nuevo Pedido*%0A${detalle}%0A%0ANombre: ${form.nombre}%0AApellido: ${form.apellido}%0ADirección: ${form.direccion}%0ATotal: $${total}`;
    const numero = "5493813670162";
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
    vaciarCarrito();
    setForm({ nombre:"", apellido:"", direccion:"" });
    setMostrarFormulario(false);
  };

  if (cart.length === 0) return null;

  return (
    <div className="carrito-container">
      <h3>Carrito de Compras</h3>

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
        <button className="btn-finalizar" onClick={() => setMostrarFormulario(true)}>
          Finalizar compra
        </button>
      ) : (
        <div className="formulario-compra">
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}/>
          <input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })}/>
          <input placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })}/>
          <button className="btn-enviar" onClick={enviarPedido}>
            Enviar pedido por WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrito;
