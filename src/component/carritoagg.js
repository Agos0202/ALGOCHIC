import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const agregarProducto = (producto) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === producto.id);
      if (exist) return prev.map(p => p.id === producto.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...producto, qty: 1 }];
    });
  };

  const eliminarProducto = (id) => setCart(prev => prev.filter(p => p.id !== id));

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) { eliminarProducto(id); return; }
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: cantidad } : p));
  };

  const vaciarCarrito = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, agregarProducto, eliminarProducto, cambiarCantidad, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
