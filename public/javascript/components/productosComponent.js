import {
  ObtenerTodosProductosService,
  AgregarProductoService,
  ObtenerProductoPorIdService,
  ActualizarProductoService,
  EliminarProductoService
} from "../../../private/api.js";

class ProductoElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
    this.renderTabla();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
      :host { display: block; font-family: sans-serif; }
    </style>

    <div class="p-6 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-3xl mx-auto animate-fade-in">
      <h2 class="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
        Gestión de Productos
      </h2>

      <form id="formProducto" class="space-y-4 mb-8">
        <input type="text" id="nombreProducto" placeholder="Nombre del producto"
          required class="border border-gray-300 px-4 py-2 w-full rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200" />
        <input type="number" step="0.01" id="precioProducto" placeholder="Precio"
          required class="border border-gray-300 px-4 py-2 w-full rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200" />
        <button type="submit"
          class="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md">
          Guardar Producto
        </button>
      </form>

      <h3 class="text-2xl font-semibold mb-4">Listado de Productos</h3>
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-300 text-left rounded-xl overflow-hidden shadow-md">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 border">Nombre</th>
              <th class="p-3 border">Precio</th>
              <th class="p-3 border text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="tbodyProductos" class="bg-white"></tbody>
        </table>
      </div>
    </div>

    <!-- Modal de edición -->
    <dialog id="modalEditar" class="rounded-xl backdrop:bg-black/50 p-0 shadow-2xl">
      <form method="dialog" class="bg-white rounded-xl p-6 w-96 space-y-4 animate-fade-in">
        <h4 class="text-xl font-bold text-gray-800">Editar Producto</h4>
        <input type="text" id="editarNombre" class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="number" step="0.01" id="editarPrecio" class="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <div class="flex justify-end space-x-2 pt-2">
          <button type="button" id="btnCancelarEdicion"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800 transition">Cancelar</button>
          <button type="submit" id="btnGuardarEdicion"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Guardar</button>
        </div>
      </form>
    </dialog>
    `;
  }

  setupListeners() {
    const form = this.shadowRoot.querySelector("#formProducto");
    const modal = this.shadowRoot.querySelector("#modalEditar");

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

    this.shadowRoot.querySelector("#btnCancelarEdicion").addEventListener("click", () => {
      modal.close();
    });

    this.shadowRoot.querySelector("#btnGuardarEdicion").addEventListener("click", (e) => {
      e.preventDefault();
      const id = parseInt(modal.getAttribute("data-id"));
      const nombre = this.shadowRoot.querySelector("#editarNombre").value.trim();
      const precio = parseFloat(this.shadowRoot.querySelector("#editarPrecio").value);
      if (nombre && !isNaN(precio)) {
        ActualizarProductoService(id, { nombre, precio });
        modal.close();
        this.renderTabla();
      }
    });
  }

  renderTabla() {
    const productos = ObtenerTodosProductosService();
    const tbody = this.shadowRoot.querySelector("#tbodyProductos");
    const modal = this.shadowRoot.querySelector("#modalEditar");

    tbody.innerHTML = productos.map(p => `
      <tr>
        <td class="border p-2">${p.nombre}</td>
        <td class="border p-2">$${p.precio.toFixed(2)}</td>
        <td class="border p-2 flex gap-2 justify-center">
          <button data-id="${p.id}" class="btnEditar bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
          <button data-id="${p.id}" class="btnEliminar bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
        </td>
      </tr>
    `).join("");

    this.shadowRoot.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        EliminarProductoService(id);
        this.renderTabla();
      });
    });

    this.shadowRoot.querySelectorAll(".btnEditar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const producto = ObtenerProductoPorIdService(id);
        if (producto) {
          this.shadowRoot.querySelector("#editarNombre").value = producto.nombre;
          this.shadowRoot.querySelector("#editarPrecio").value = producto.precio;
          modal.setAttribute("data-id", id);
          modal.showModal();
        }
      });
    });
  }
}

customElements.define("producto-element", ProductoElement);
