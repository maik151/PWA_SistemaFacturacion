import  {
  
  obtenerTodosLosProductos,
  guardarProductos,
  agregarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  limpiarProductos
}from "../private/modulos/productos.js";

import {
  obtenerTodosLosClientes,
  obtenerClientePorId,
  guardarClientesEnLocalStorage,
  agregarCliente,
  actualizarCliente,
  eliminarCliente,
  limpiarClientes
} from "../private/modulos/clientes.js"; // ajusta la ruta según tu estructura real



//Productos Services
function ObtenerTodosProductosService(){
    return obtenerTodosLosProductos();
}

function GuardarProductosService(productos){
    guardarProductos(productos);
}

function AgregarProductoService(productoData){
    return agregarProducto(productoData);
}

function ObtenerProductoPorIdService(id) {
    return obtenerProductoPorId(id);
}


function ActualizarProductoService(id, nombre, precio) {
    return actualizarProducto(id, nombre, precio);
}

function EliminarProductoService(id) {
    return eliminarProducto(id);
} 

function LimpiarProductosService() {
    return limpiarProductos();
}

// Cliente Services
function ObtenerTodosClientesService() {
  return obtenerTodosLosClientes();
}

function ObtenerClientePorIdService(id) {
  return obtenerClientePorId(id);
}

function GuardarClientesService(clientes) {
  return guardarClientesEnLocalStorage(clientes);
}

function AgregarClienteService(clienteData) {
  return agregarCliente(clienteData);
}

function ActualizarClienteService(id, clienteData) {
  return actualizarCliente(id, clienteData.nombre, clienteData.cedula, clienteData.direccion); // ← retorna booleano
}

function EliminarClienteService(id) {
  return eliminarCliente(id); // ← retorna booleano
}

function LimpiarClientesService() {
  limpiarClientes();
}



export{
    //Export Productos Services
    ObtenerTodosProductosService,
    GuardarProductosService,
    AgregarProductoService,
    ObtenerProductoPorIdService,
    ActualizarProductoService,
    EliminarProductoService,
    LimpiarProductosService,

    //Export Clientes Services
    ObtenerTodosClientesService,
    ObtenerClientePorIdService,
    GuardarClientesService,
    AgregarClienteService,
    ActualizarClienteService,
    EliminarClienteService,
    LimpiarClientesService
}





