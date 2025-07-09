import  {
  
  obtenerTodosLosProductos,
  guardarProductos,
  agregarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  limpiarProductos
}from "../private/modulos/productos.js";


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

export{
    ObtenerTodosProductosService,
    GuardarProductosService,
    AgregarProductoService,
    ObtenerProductoPorIdService,
    ActualizarProductoService,
    EliminarProductoService,
    LimpiarProductosService
}





