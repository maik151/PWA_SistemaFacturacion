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
      <link href="./styles/css/bootstrap.min.css" rel="stylesheet" />
      <script src="./styles/js/bootstrap.bundle.min.js"></script>

      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
        }

        .grupo-producto {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;\
          
        }

        .grupo-producto input {
          flex: 1;
        }

        dialog::backdrop {
          background: rgba(0, 0, 0, 0.5);
        }

        #modalFacturas[open] {
          display: block;
        }

        .botones-form{
          display: flex;
          gap: 0.5rem;
          
          }

        #modalFacturas {
          display: none;
          border: none;
          border-radius: 1rem;
          width: 90vw;
          max-width: 800px;
          padding: 2rem;
          background: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          font-size: 1rem;
        }

        #modalFacturas h4 {
          border-bottom: 2px solid #0d6efd;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          color: #0d6efd;
        }

        table.table {
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(13, 110, 253, 0.15);
        }

        table.table thead th {
          background-color: #0d6efd;
          color: white;
          font-weight: 600;
          text-align: center;
          border: none;
        }

        table.table tbody tr:hover {
          background-color: #e9f0ff;
          cursor: pointer;
        }

        table.table tbody td {
          vertical-align: middle;
          text-align: center;
        }

        #btnCerrarModal {
          min-width: 100px;
          font-weight: 600;
        }
      </style>

      <div class="p-4 mx-auto bg-white rounded shadow-sm" style="max-width: 800px;">
        <h2 class="text-center text-primary mb-4 fw-bold">Generar Factura</h2>
        <form id="formFactura" class="mb-3">
          <div class="mb-3">
            <select id="clienteFactura" class="form-select" required>
              <option value="">Seleccionar Cliente</option>
            </select>
          </div>

          <div id="productosContainer">
            <div class="grupo-producto">
              <input type="text" class="producto form-control" placeholder="Producto" required />
              <input type="number" class="cantidad form-control" placeholder="Cantidad" min="1" required />
              <input type="number" class="precio form-control" placeholder="Precio Unitario" min="0" step="0.01" required />
            </div>
          </div>

          <div class="botones-form d-flex gap-2 mb-3">
            <button type="button" id="btnAgregarFila" class="btn btn-success">+</button>
            <button type="button" id="btnEliminarFila" class="btn btn-danger" disabled>-</button>
            <button type="submit" class="btn btn-primary ms-auto">Generar Factura</button>
          </div>
        </form>

        <section id="resultadoFactura" class="bg-light p-3 rounded shadow-sm"></section>

        <div class="mt-4">
          <button id="btnMostrarFacturas" class="btn btn-info w-100">Ver Facturas Guardadas</button>
        </div>
      </div>

      <dialog id="modalFacturas" class="shadow-lg">
        <h4 class="fw-bold mb-3">Listado de Facturas Guardadas</h4>
        <table class="table table-bordered table-hover rounded">
          <thead class="table-primary">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="tbodyFacturas"></tbody>
        </table>
        <div class="d-flex justify-content-end mt-3">
          <button id="btnCerrarModal" class="btn btn-secondary">Cerrar</button>
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
    const modalFacturas = this.shadowRoot.querySelector("#modalFacturas");
    const btnMostrarFacturas = this.shadowRoot.querySelector("#btnMostrarFacturas");
    const btnCerrarModal = this.shadowRoot.querySelector("#btnCerrarModal");

    btnAgregarFila.addEventListener("click", () => {
      if (productosContainer.children.length < this.maxFilas) {
        const nuevaFila = document.createElement("div");
        nuevaFila.className = "grupo-producto";
        nuevaFila.innerHTML = `
          <input type="text" class="producto form-control" placeholder="Producto" required />
          <input type="number" class="cantidad form-control" placeholder="Cantidad" min="1" required />
          <input type="number" class="precio form-control" placeholder="Precio Unitario" min="0" step="0.01" required />
        `;
        productosContainer.appendChild(nuevaFila);
        this.actualizarEstadoBotones();
      }
    });

    btnEliminarFila.addEventListener("click", () => {
      const filas = productosContainer.querySelectorAll(".grupo-producto");
      if (filas.length > 1) {
        productosContainer.removeChild(filas[filas.length - 1]);
        this.actualizarEstadoBotones();
      }
    });

    formFactura.addEventListener("submit", (e) => {
      e.preventDefault();
      const clienteSelect = this.shadowRoot.querySelector("#clienteFactura");
      const clienteId = parseInt(clienteSelect.value);
      const clienteNombre = clienteSelect.options[clienteSelect.selectedIndex].text;

      const filas = productosContainer.querySelectorAll(".grupo-producto");
      const productos = [];
      let subtotal = 0;
      let filasHTML = "";

      filas.forEach(fila => {
        const nombre = fila.querySelector(".producto").value.trim();
        const cantidad = parseInt(fila.querySelector(".cantidad").value);
        const precio = parseFloat(fila.querySelector(".precio").value);
        const total = cantidad * precio;
        subtotal += total;

        productos.push({ idProducto: nombre, cantidad, precio });
        filasHTML += `<tr><td>${nombre}</td><td>${cantidad}</td><td>$${precio.toFixed(2)}</td><td>$${total.toFixed(2)}</td></tr>`;
      });

      const iva = subtotal * 0.12;
      const total = subtotal + iva;

      const factura = AgregarFacturaService(clienteId, productos, clienteNombre);

      resultadoFactura.innerHTML = `
        <h5 class="fw-bold">Factura</h5>
        <p><strong>Cliente:</strong> ${clienteNombre}</p>
        <p><strong>Fecha:</strong> ${factura.fecha}</p>
        <table class="table table-sm table-bordered">
          <thead>
            <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>
          </thead>
          <tbody>${filasHTML}</tbody>
          <tfoot>
            <tr><td colspan="3" class="text-end fw-semibold">IVA (12%)</td><td>$${iva.toFixed(2)}</td></tr>
            <tr><td colspan="3" class="text-end fw-bold">Total</td><td>$${total.toFixed(2)}</td></tr>
          </tfoot>
        </table>
      `;

      formFactura.reset();
      while (productosContainer.children.length > 1) {
        productosContainer.removeChild(productosContainer.lastChild);
      }
      this.actualizarEstadoBotones();
    });

    btnMostrarFacturas.addEventListener("click", () => {
      this.renderFacturasGuardadas();
      modalFacturas.showModal();
    });

    btnCerrarModal.addEventListener("click", () => {
      modalFacturas.close();
    });
  }

  actualizarEstadoBotones() {
    const productosContainer = this.shadowRoot.querySelector("#productosContainer");
    const totalFilas = productosContainer.children.length;
    this.shadowRoot.querySelector("#btnAgregarFila").disabled = totalFilas >= this.maxFilas;
    this.shadowRoot.querySelector("#btnEliminarFila").disabled = totalFilas <= 1;
  }

  cargarClientes() {
    const select = this.shadowRoot.querySelector("#clienteFactura");
    const clientes = ObtenerTodosClientesService();
    select.innerHTML = `<option value="">Seleccionar Cliente</option>`;
    clientes.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `${c.nombre} (${c.cedula})`;
      select.appendChild(option);
    });
  }

  renderFacturasGuardadas() {
    const tbody = this.shadowRoot.querySelector("#tbodyFacturas");
    const facturas = ObtenerTodasFacturasService();
    tbody.innerHTML = facturas.map(f => `
      <tr>
        <td>${f.id}</td>
        <td>${f.clienteNombre}</td>
        <td>${f.fecha}</td>
        <td>$${f.total.toFixed(2)}</td>
      </tr>
    `).join("");
  }
}

customElements.define("facturacion-element", FacturacionElement);
