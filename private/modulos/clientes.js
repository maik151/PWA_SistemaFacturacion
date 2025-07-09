function MapearClienteObject(id, nombreParam, cedulaParam, direccionParam) {
  return {
    id: id,
    nombre: nombreParam,
    cedula: cedulaParam,
    direccion: direccionParam
  };
}

// Obtener todos los clientes desde localStorage
function obtenerTodosLosClientes() {
  const datos = localStorage.getItem("clientes");
  return datos ? JSON.parse(datos) : [];
}

// Obtener un cliente por ID desde localStorage
function obtenerClientePorId(id) {
  const clientes = obtenerTodosLosClientes();
  return clientes.find(cliente => cliente.id === id);
}

// Guardar el array de clientes en localStorage
function guardarClientesEnLocalStorage(clientes) {
  localStorage.setItem("clientes", JSON.stringify(clientes));
  console.log("Clientes guardados en Local Storage.");
}

// Agregar un nuevo cliente
function agregarCliente(clienteData) {
  let clientes = obtenerTodosLosClientes();

  // Obtener el máximo ID actual (0 si no hay clientes)
  let maxId = clientes.reduce((max, c) => Math.max(max, c.id), 0);

  // Asignar nuevo ID sumando 1
  let nuevoId = maxId + 1;

  // Crear cliente con ID nuevo y datos recibidos
  let nuevoCliente = MapearClienteObject(nuevoId, clienteData.nombre, clienteData.cedula, clienteData.direccion);

  clientes.push(nuevoCliente);
  guardarClientesEnLocalStorage(clientes);

  console.log("Cliente agregado con id:", nuevoId);
  return nuevoCliente;
}

// Actualizar cliente existente
function actualizarCliente(id, nombre, cedula, direccion) {
  const clientes = obtenerTodosLosClientes();
  const index = clientes.findIndex(c => c.id === id);
  if (index !== -1) {
    clientes[index] = MapearClienteObject(id, nombre, cedula, direccion);
    guardarClientesEnLocalStorage(clientes);
    console.log("Cliente actualizado:", id);
    return true;
  }
  return false;
}

// Eliminar cliente por ID
function eliminarCliente(id) {
  let clientes = obtenerTodosLosClientes();
  const clienteExiste = clientes.some(c => c.id === id);
  if (!clienteExiste) return false;

  clientes = clientes.filter(c => c.id !== id);
  guardarClientesEnLocalStorage(clientes);
  console.log("Cliente eliminado:", id);
  return true;
}

// Eliminar todos los clientes (limpiar storage)
function limpiarClientes() {
  localStorage.removeItem("clientes");
  console.log("Clientes eliminados del Local Storage.");
}


export {
  
  obtenerTodosLosClientes,
  obtenerClientePorId,
  guardarClientesEnLocalStorage,
  agregarCliente,
  actualizarCliente,
  eliminarCliente,
  limpiarClientes
};