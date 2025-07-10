import {
  ObtenerTodosClientesService
} from "../../../private/api.js";

import {
  ObtenerTodasFacturasService,
  AgregarFacturaService
} from "../../../private/api.js";

class FacturacionElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.maxFilas = 5;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.cargarClientes();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

        :host {
          display: block;
          font-family: 'Inter', sans-serif;
        }

        .grupo-producto {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .grupo-producto input {
          flex: 1;
        }

        dialog::backdrop {
          background: rgba(0,0,0,0.5);
        }
      </style>

      <div class="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
        <h2 class="text-3xl font-bold mb-6 text-indigo-600">Generar Factura</h2>
        <form id="formFactura" class="space-y-4">
          <select id="clienteFactura" required class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Seleccionar Cliente</option>
          </select>

          <div id="productosContainer">
            <div class="grupo-producto">
              <input type="text" class="producto border rounded px-3 py-2" placeholder="Producto" required />
              <input type="number" class="cantidad border rounded px-3 py-2" placeholder="Cantidad" min="1" required />
              <input type="number" class="precio border rounded px-3 py-2" placeholder="Precio Unitario" step="0.01" min="0" required />
            </div>
          </div>

          <div class="flex gap-2">
            <button type="button" id="btnAgregarFila" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">+</button>
            <button type="button" id="btnEliminarFila" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" disabled>-</button>
            <button type="submit" class="ml-auto bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">Generar Factura</button>
          </div>
        </form>

        <section class="mt-8">
          <h3 class="text-2xl font-semibold mb-2">Factura Generada</h3>
          <div id="resultadoFactura" class="p-4 bg-gray-50 rounded shadow min-h-[100px]"></div>
        </section>

        <section class="mt-10">
          <button id="btnMostrarFacturas" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Ver Todas las Facturas</button>
        </section>
      </div>

      <dialog id="modalFacturas" class="w-[90vw] max-w-4xl rounded-xl p-6">
        <h3 class="text-xl font-bold mb-4">Listado de Facturas Guardadas</h3>
        <table class="w-full border-collapse border border-gray-300 text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 p-2">ID Factura</th>
              <th class="border border-gray-300 p-2">Cliente</th>
              <th class="border border-gray-300 p-2">Fecha</th>
              <th class="border border-gray-300 p-2">Total</th>
            </tr>
          </thead>
          <tbody id="tbodyFacturas"></tbody>
        </table>
        <div class="mt-4 flex justify-end">
          <button id="btnCerrarModal" class="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500">Cerrar</button>
        </div>
      </dialog>
    `;
  }

  setupEventListeners() {
    const productosContainer = this.shadowRoot.querySelector("#productosContainer");
    const btnAgregarFila = this.shadowRoot.querySelector("#btnAgregarFila");
    const btnEliminarFila = this.shadowRoot.querySelector("#btnEliminarFila");
    const formFactura = this.shadowRoot.querySelector("#formFactura");
    const resultadoFactura = this.shadowRoot.querySelector("#resultadoFactura");
    const btnMostrarFacturas = this.shadowRoot.querySelector("#btnMostrarFacturas");
    const modalFacturas = this.shadowRoot.querySelector("#modalFacturas");
    const btnCerrarModal = this.shadowRoot.querySelector("#btnCerrarModal");

    // Agregar fila
    btnAgregarFila.addEventListener("click", () => {
      const grupos = productosContainer.querySelectorAll(".grupo-producto");
      if (grupos.length < this.maxFilas) {
        const nuevaFila = document.createElement("div");
        nuevaFila.className = "grupo-producto";
        nuevaFila.innerHTML = `
          <input type="text" class="producto border rounded px-3 py-2" placeholder="Producto" required />
          <input type="number" class="cantidad border rounded px-3 py-2" placeholder="Cantidad" min="1" required />
          <input type="number" class="precio border rounded px-3 py-2" placeholder="Precio Unitario" step="0.01" min="0" required />
        `;
        productosContainer.appendChild(nuevaFila);
        this.actualizarEstadoBotones();
      }
    });

    // Eliminar fila
    btnEliminarFila.addEventListener("click", () => {
      const grupos = productosContainer.querySelectorAll(".grupo-producto");
      if (grupos.length > 1) {
        productosContainer.removeChild(grupos[grupos.length - 1]);
        this.actualizarEstadoBotones();
      }
    });

    // Envío del formulario para generar factura
    formFactura.addEventListener("submit", (e) => {
      e.preventDefault();

      const clienteId = parseInt(this.shadowRoot.querySelector("#clienteFactura").value);
      if (!clienteId) {
        alert("Seleccione un cliente.");
        return;
      }

      const filas = productosContainer.querySelectorAll(".grupo-producto");
      const productos = [];
      let filasHTML = "";
      let subtotal = 0;

      filas.forEach(fila => {
        const nombre = fila.querySelector(".producto").value.trim();
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

      const factura = AgregarFacturaService(clienteId, productos);
      const clientes = ObtenerTodosClientesService();
      const clienteSeleccionado = clientes.find(c => c.id === clienteId);

      resultadoFactura.innerHTML = `
        <div class="factura p-4 bg-white rounded shadow">
          <h4 class="text-xl font-semibold mb-2">Factura</h4>
          <p><strong>Cliente:</strong> ${clienteSeleccionado.nombre} (${clienteSeleccionado.cedula})</p>
          <p><strong>Fecha:</strong> ${factura.fecha}</p>
          <table class="w-full border-collapse border border-gray-300 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 p-2">Producto</th>
                <th class="border border-gray-300 p-2">Cantidad</th>
                <th class="border border-gray-300 p-2">Precio Unitario</th>
                <th class="border border-gray-300 p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>${filasHTML}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right font-semibold p-2">IVA (12%)</td>
                <td class="border border-gray-300 p-2">$${iva.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-right font-bold p-2">Total</td>
                <td class="border border-gray-300 p-2 font-bold">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;

      formFactura.reset();
      // Reset to 1 product row
      while (productosContainer.children.length > 1) {
        productosContainer.removeChild(productosContainer.lastChild);
      }
      this.actualizarEstadoBotones();
    });

    // Mostrar listado de facturas en modal
    btnMostrarFacturas.addEventListener("click", () => {
      this.renderFacturasGuardadas();
      modalFacturas.showModal();
    });

    // Cerrar modal
    btnCerrarModal.addEventListener("click", () => {
      modalFacturas.close();
    });
  }

  actualizarEstadoBotones() {
    const productosContainer = this.shadowRoot.querySelector("#productosContainer");
    const btnAgregarFila = this.shadowRoot.querySelector("#btnAgregarFila");
    const btnEliminarFila = this.shadowRoot.querySelector("#btnEliminarFila");
    const totalFilas = productosContainer.querySelectorAll(".grupo-producto").length;

    btnEliminarFila.disabled = totalFilas <= 1;
    btnAgregarFila.disabled = totalFilas >= this.maxFilas;
  }

  cargarClientes() {
    const selectCliente = this.shadowRoot.querySelector("#clienteFactura");
    selectCliente.innerHTML = `<option value="">Seleccionar Cliente</option>`;

    const clientes = ObtenerTodosClientesService();

    clientes.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `${c.nombre} (${c.cedula})`;
      selectCliente.appendChild(option);
    });
  }

  renderFacturasGuardadas() {
    const tbody = this.shadowRoot.querySelector("#tbodyFacturas");
    const facturas = ObtenerTodasFacturasService();
    const clientes = ObtenerTodosClientesService();

    tbody.innerHTML = facturas.map(f => {
      const cliente = clientes.find(c => c.id === f.clienteId);
      const nombreCliente = cliente ? cliente.nombre : "Desconocido";
      return `
        <tr>
          <td class="border border-gray-300 p-2">${f.id}</td>
          <td class="border border-gray-300 p-2">${nombreCliente}</td>
          <td class="border border-gray-300 p-2">${f.fecha}</td>
          <td class="border border-gray-300 p-2">$${f.total.toFixed(2)}</td>
        </tr>
      `;
    }).join("");
  }
}

customElements.define("facturacion-element", FacturacionElement);
