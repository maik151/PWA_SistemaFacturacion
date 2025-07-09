// facturasMain.js
import { obtenerTodosLosClientes } from "../modulos/clientes.js";
import { agregarFactura } from "../modulos/facturas.js";

function inicializarModuloFacturas() {
  const productosContainer = document.getElementById("productosContainer");
  const btnAgregarFila = document.getElementById("btnAgregarFila");
  const btnEliminarFila = document.getElementById("btnEliminarFila");
  const formFactura = document.getElementById("formFactura");
  const resultadoFactura = document.getElementById("resultadoFactura");

  // Reemplazar input de cliente por un <select>
  const inputCliente = document.getElementById("clienteFactura");
  const selectCliente = document.createElement("select");
  selectCliente.id = "clienteFactura";
  selectCliente.required = true;

  const clientes = obtenerTodosLosClientes();

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Seleccionar Cliente";
  selectCliente.appendChild(optionDefault);

  clientes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = `${c.nombre} (${c.cedula})`;
    selectCliente.appendChild(option);
  });

  inputCliente.replaceWith(selectCliente);

  // Estado inicial de botones
  actualizarEstadoBotones();

  // Agregar fila
  btnAgregarFila.addEventListener("click", () => {
    const grupos = productosContainer.querySelectorAll(".grupo-producto");
    if (grupos.length < 5) {
      const nuevaFila = document.createElement("div");
      nuevaFila.className = "grupo-producto";
      nuevaFila.innerHTML = `
        <input type="text" class="producto" placeholder="Producto" required />
        <input type="number" class="cantidad" placeholder="Cantidad" required />
        <input type="number" class="precio" placeholder="Precio Unitario" required />
      `;
      productosContainer.appendChild(nuevaFila);
    }
    actualizarEstadoBotones();
  });

  // Eliminar fila
  btnEliminarFila.addEventListener("click", () => {
    const grupos = productosContainer.querySelectorAll(".grupo-producto");
    if (grupos.length > 1) {
      productosContainer.removeChild(grupos[grupos.length - 1]);
    }
    actualizarEstadoBotones();
  });

  // Habilitar/deshabilitar botones
  function actualizarEstadoBotones() {
    const totalFilas = productosContainer.querySelectorAll(".grupo-producto").length;
    btnEliminarFila.disabled = totalFilas <= 1;
    btnAgregarFila.disabled = totalFilas >= 5;
  }

  // Generar factura
  formFactura.addEventListener("submit", function (e) {
    e.preventDefault();

    const clienteId = parseInt(document.getElementById("clienteFactura").value);
    const filas = productosContainer.querySelectorAll(".grupo-producto");

    if (!clienteId) {
      alert("Seleccione un cliente.");
      return;
    }

    const productos = [];
    let filasHTML = "";
    let subtotal = 0;

    filas.forEach(fila => {
      const nombre = fila.querySelector(".producto").value;
      const cantidad = parseInt(fila.querySelector(".cantidad").value);
      const precio = parseFloat(fila.querySelector(".precio").value);
      const totalFila = cantidad * precio;
      subtotal += totalFila;

      productos.push({ idProducto: nombre, cantidad, precio });

      filasHTML += `
        <tr>
          <td>${nombre}</td>
          <td>${cantidad}</td>
          <td>$${precio.toFixed(2)}</td>
          <td>$${totalFila.toFixed(2)}</td>
        </tr>
      `;
    });

    const iva = subtotal * 0.12;
    const total = subtotal + iva;

    const factura = agregarFactura(clienteId, productos); // ✅ Se guarda en localStorage
    const clienteSeleccionado = clientes.find(c => c.id === clienteId);

    resultadoFactura.innerHTML = `
      <div class="factura">
        <h4>Factura</h4>
        <p><strong>Cliente:</strong> ${clienteSeleccionado.nombre} (${clienteSeleccionado.cedula})</p>
        <p><strong>Fecha:</strong> ${factura.fecha}</p>
        <table class="tabla-factura">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${filasHTML}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>IVA (12%)</strong></td>
              <td>$${iva.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>$${total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  });
}

export { inicializarModuloFacturas };
