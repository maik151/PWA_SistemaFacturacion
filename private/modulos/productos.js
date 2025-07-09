
// Obtener todos los productos desde localStorage
function obtenerTodosLosProductos() {
  return JSON.parse(localStorage.getItem("productos") || "[]");
}

// Guardar productos en localStorage
function guardarProductos(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

// Agregar un nuevo producto con ID automático
function agregarProducto(productoData) {
  let productos = obtenerTodosLosProductos();

  let maxId = productos.reduce((max, p) => Math.max(max, p.id), 0);
  let nuevoId = maxId + 1;

  let nuevoProducto = {
    id: nuevoId,
    nombre: productoData.nombre,
    precio: productoData.precio
  };

  productos.push(nuevoProducto);
  guardarProductos(productos);

  console.log("Producto agregado con id:", nuevoId);
  return nuevoProducto;
}

// Obtener un producto por ID
function obtenerProductoPorId(id) {
  const productos = obtenerTodosLosProductos();
  return productos.find(p => p.id === id);
}

// Actualizar un producto por ID
function actualizarProducto(id, nombre, precio) {
  let productos = obtenerTodosLosProductos();
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    productos[index] = {
      id: id,
      nombre: nombre,
      precio: precio
    };
    guardarProductos(productos);
    console.log("Producto actualizado:", id);
    return true;
  }
  return false;
}

function eliminarProducto(id) {
  let productos = obtenerTodosLosProductos();
  const inicialLength = productos.length;
  productos = productos.filter(p => p.id !== id);
  guardarProductos(productos);
  const eliminado = productos.length < inicialLength;
  if (eliminado) console.log("Producto eliminado:", id);
  return eliminado;
}

// Eliminar todos los productos
function limpiarProductos() {
  localStorage.removeItem("productos");
  console.log("Todos los productos han sido eliminados.");
  return true;
}

export {
  obtenerTodosLosProductos,
  guardarProductos,
  agregarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  limpiarProductos
};