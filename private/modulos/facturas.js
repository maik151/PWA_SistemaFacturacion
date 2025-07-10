// Obtener todas las facturas desde localStorage
function obtenerTodasLasFacturas() {
  return JSON.parse(localStorage.getItem("facturas") || "[]");
}

// Guardar facturas en localStorage
function guardarFacturas(facturas) {
  localStorage.setItem("facturas", JSON.stringify(facturas));
}

// Crear una nueva factura
function agregarFactura(clienteId, productos, clienteNombre) {
  let facturas = obtenerTodasLasFacturas();

  // Calcular nuevo ID
  let maxId = facturas.reduce((max, f) => Math.max(max, f.id), 0);
  let nuevoId = maxId + 1;

  let subtotal = 0;
  const productosProcesados = productos.map(p => {
    const subtotalProducto = p.cantidad * p.precio;
    subtotal += subtotalProducto;
    return {
      idProducto: p.idProducto,
      cantidad: p.cantidad,
      precio: p.precio,
      subtotal: subtotalProducto
    };
  });

  const iva = subtotal * 0.12;
  const total = subtotal + iva;

  const nuevaFactura = {
    id: nuevoId,
    clienteId,
    clienteNombre,      // Guardamos el nombre aquí
    fecha: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    productos: productosProcesados,
    subtotal,
    iva,
    total
  };

  facturas.push(nuevaFactura);
  localStorage.setItem("facturas", JSON.stringify(facturas));

  return nuevaFactura;
}


// Obtener una factura por ID
function obtenerFacturaPorId(id) {
  const facturas = obtenerTodasLasFacturas();
  return facturas.find(f => f.id === id);
}

// Eliminar una factura por ID
function eliminarFactura(id) {
  let facturas = obtenerTodasLasFacturas();
  facturas = facturas.filter(f => f.id !== id);
  guardarFacturas(facturas);
  console.log("Factura eliminada:", id);
}

// Eliminar todas las facturas
function limpiarFacturas() {
  localStorage.removeItem("facturas");
  console.log("Todas las facturas han sido eliminadas.");
}

export {
  obtenerTodasLasFacturas,
  agregarFactura,
  obtenerFacturaPorId,
  eliminarFactura,
  limpiarFacturas
};
