import {
    ObtenerTodosProductosService,
    GuardarProductosService,
    AgregarProductoService,
    ObtenerProductoPorIdService,
    ActualizarProductoService,
    EliminarProductoService,
    LimpiarProductosService
} from "../../../private/api.js";

class ProductoElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.renderTabla();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
        :host {
          display: block;
          font-family: sans-serif;
        }
      </style>
      <div class="p-6 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto">
        <h2 class="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Gestión de Productos
        </h2>
        <form id="formProducto" class="space-y-4 mb-8">
          <input type="text" id="nombreProducto" placeholder="Nombre del producto"
            required class="border px-4 py-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="number" step="0.01" id="precioProducto" placeholder="Precio"
            required class="border px-4 py-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
            Guardar Producto
          </button>
        </form>
        <h3 class="text-2xl font-semibold mb-4">Listado de Productos</h3>
        <div class="overflow-x-auto">
          <table class="w-full border border-gray-300 text-left rounded-xl overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-3 border">Nombre</th>
                <th class="p-3 border">Precio</th>
                <th class="p-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbodyProductos" class="bg-white"></tbody>
          </table>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector("#formProducto");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nombre = this.shadowRoot.querySelector("#nombreProducto").value.trim();
      const precio = parseFloat(this.shadowRoot.querySelector("#precioProducto").value);

      if (nombre && !isNaN(precio)) {
        AgregarProductoService({ nombre, precio });
        this.renderTabla();
        form.reset();
      }
    });
  }

  renderTabla() {
    const tbody = this.shadowRoot.querySelector("#tbodyProductos");
    const productos = ObtenerTodosProductosService();

    tbody.innerHTML = productos.map(p => `
      <tr>
        <td class="border p-2">${p.nombre}</td>
        <td class="border p-2">$${p.precio.toFixed(2)}</td>
        <td class="border p-2">
          <button data-id="${p.id}" class="btnEliminar bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
        </td>
      </tr>
    `).join("");

    // Agrega eventos a botones
    this.shadowRoot.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(btn.getAttribute("data-id"));
        EliminarProductoService(id);
        this.renderTabla();
      });
    });
  }
}

customElements.define("producto-element", ProductoElement);
