
import { inicializarModuloClientes } from "./main/clientesMain.js";
import { inicializarModuloProductos } from "./main/productosMain.js";
import { inicializarModuloFacturas } from "./main/facturasMain.js";

// En este caso, ejecutamos un eveto tipo ContentLoaded para asegurarnos de que el DOM esté completamente cargado antes de intentar manipularlo.
document.addEventListener("DOMContentLoaded", () => {
//importamos en constantes el menu de navegacion, y el contenedor principal donde se mostrará el contenido dinámico.
  const enlacesMenu = document.querySelectorAll("nav.menu-navegacion a");
  const contenedorPrincipal = document.querySelector(".contenedor-principal");
// tambien importamos del HTML el panel dinamico, si no existe lo creamos.
  let panelDinamico = document.getElementById("panel-dinamico");
  if (!panelDinamico) {
    panelDinamico = document.createElement("div");
    panelDinamico.id = "panel-dinamico";
    panelDinamico.classList.add("panel-dinamico");
    contenedorPrincipal.appendChild(panelDinamico);
  }
//Declaramos la funcion de cargarContenido, donde funciona en base a un switch que recibe una seccion y segun eso carga determinada ventana.  
function cargarContenido(seccion) {
    switch (seccion) {
      case "clientes":
        panelDinamico.innerHTML = `
        <h2>Gestión de Clientes</h2>
        <form id="formCliente">
            <input type="text" id="nombreCliente" placeholder="Nombre" required />
            <input type="text" id="cedulaCliente" placeholder="Cédula" required />
            <input type="text" id="direccionCliente" placeholder="Dirección" required />
            <button type="submit">Guardar Cliente</button>
            <button type="button" id="btnRecargarClientes">RELOAD</button>
        </form>

        <h3>Listado de Clientes</h3>
        <table id="tablaClientes">
            <thead>
            <tr><th>Nombre</th><th>Cédula</th><th>Dirección</th><th>Acciones</th></tr>
            </thead>
            <tbody></tbody>
        </table>
        `;
        // Aquí llamamos a la función inicializarModuloClientes que se encargará de manejar la lógica del módulo de clientes.
        // Verificamos si la función inicializarModuloClientes está definida y la llamamos.
        if (typeof inicializarModuloClientes === "function") {
        inicializarModuloClientes();
        }
        
        break;

      case "productos":
        panelDinamico.innerHTML = `
            <h2>Gestión de Productos</h2>
            <form id="formProducto">
            <input type="text" id="nombreProducto" placeholder="Nombre del producto" required />
            <input type="number" step="0.01" id="precioProducto" placeholder="Precio" required />
            <button type="submit">Guardar Producto</button>
            </form>
            <h3>Listado de Productos</h3>
            <table id="tablaProductos">
            <thead>
                <tr><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>
            </thead>
            <tbody></tbody>
            </table>
        `;
        if (typeof inicializarModuloProductos === "function") {
            inicializarModuloProductos();
        }
    break;

      // En este caso jugamos un poco con la generacion de contenido dinamico, donde definimos resultadoFactura de nuevo, mapeamos los campos de dicha factura en un HTML y lo insertamos con innerHTML
      // este innerHTML se ejecuta dentro del evento submit del formulario.
      case "facturacion":
        panelDinamico.innerHTML = `
            <h2>Generar Factura</h2>
            <form id="formFactura">
                <select id="clienteFactura" required>
                    <option value="">Seleccionar Cliente</option>
                </select>

                <div id="productosContainer">
                    <div class="grupo-producto">
                        <input type="text" class="producto" placeholder="Producto" required />
                        <input type="number" class="cantidad" placeholder="Cantidad" required />
                        <input type="number" class="precio" placeholder="Precio Unitario" required />
                    </div>
                </div>

                <div class="controles-productos">
                    <button type="button" id="btnAgregarFila">+</button>
                    <button type="button" id="btnEliminarFila" disabled>-</button>
                </div>

                <button type="submit">Generar Factura</button>
            </form>

            <h3>Factura Generada</h3>
            <div id="resultadoFactura"></div>
        `;

    // Cargar lógica del módulo facturas
    if (typeof inicializarModuloFacturas === "function") {
        inicializarModuloFacturas();
    }
    break;

      default:
        panelDinamico.innerHTML = `<p>Sección no reconocida.</p>`;
    }
  }


// Ejecutamos un recorrido con forEach sobre los hijos del menu de navegacion
// en este caso la constante enlacesMenu, y agregamos un evento click a cada uno de ellos.
//luego al hacer click obtenemos el atributo de data-seccion del enlace y llamamos a la función cargarContenido con ese valor.

  enlacesMenu.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const seccion = enlace.getAttribute("data-seccion");
      cargarContenido(seccion);
    });
  });
});
