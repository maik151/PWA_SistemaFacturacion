// Obtener todas las facturas desde localStorage
function obtenerTodasLasFacturas() {
  return JSON.parse(localStorage.getItem("facturas") || "[]");
}

// Guardar facturas en localStorage
function guardarFacturas(facturas) {
  localStorage.setItem("facturas", JSON.stringify(facturas));
}

// Crear una nueva factura
function agregarFactura(clienteId, productos) {
  let facturas = obtenerTodasLasFacturas();

  // Calcular ID nuevo
  let maxId = facturas.reduce((max, f) => Math.max(max, f.id), 0);
  let nuevoId = maxId + 1;

  // Calcular subtotal por producto y total general
  let total = 0;
  const productosProcesados = productos.map(p => {
    const subtotal = p.cantidad * p.precio;
    total += subtotal;
    return {
      idProducto: p.idProducto,
      cantidad: p.cantidad,
      subtotal: subtotal
    };
  });

  const nuevaFactura = {
    id: nuevoId,
    clienteId: clienteId,
    productos: productosProcesados,
    total: total,
    fecha: new Date().toISOString().split("T")[0] // YYYY-MM-DD
  };

  facturas.push(nuevaFactura);
  guardarFacturas(facturas);
  console.log("Factura creada con ID:", nuevoId);
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
