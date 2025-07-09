import {
  ObtenerTodosClientesService,
  ObtenerClientePorIdService,
  AgregarClienteService,
  ActualizarClienteService,
  EliminarClienteService,
  LimpiarClientesService
} from "../../../private/api.js";

class ClienteElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.clienteEditandoId = null;
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

      <div class="p-6 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-4xl mx-auto animate-fade-in">
        <h2 class="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-500">
          Gestión de Clientes
        </h2>

        <form id="formCliente" class="space-y-4 mb-6">
          <input type="text" id="nombreCliente" placeholder="Nombre"
            required class="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-green-400" />
          <input type="text" id="cedulaCliente" placeholder="Cédula"
            required class="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-green-400" />
          <input type="text" id="direccionCliente" placeholder="Dirección"
            required class="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-green-400" />
          <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Guardar Cliente
          </button>
        </form>

        <h3 class="text-2xl font-semibold mb-4">Listado de Clientes</h3>
        <table class="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
          <thead class="bg-gray-100">
            <tr><th class="p-2 border">Nombre</th><th class="p-2 border">Cédula</th><th class="p-2 border">Dirección</th><th class="p-2 border text-center">Acciones</th></tr>
          </thead>
          <tbody id="tbodyClientes" class="bg-white"></tbody>
        </table>

        <!-- Modal -->
        <dialog id="modalEditar" class="rounded-xl backdrop:bg-black/50 p-0 shadow-2xl">
          <form method="dialog" class="bg-white rounded-xl p-6 w-96 space-y-4 animate-fade-in">
            <h4 class="text-xl font-bold">Editar Cliente</h4>
            <input type="text" id="editarNombre" class="w-full border px-3 py-2 rounded" placeholder="Nombre" />
            <input type="text" id="editarCedula" class="w-full border px-3 py-2 rounded" placeholder="Cédula" />
            <input type="text" id="editarDireccion" class="w-full border px-3 py-2 rounded" placeholder="Dirección" />
            <div class="flex justify-end space-x-2">
              <button type="button" id="btnCancelarEdicion" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button type="submit" id="btnGuardarEdicion" class="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
            </div>
          </form>
        </dialog>
      </div>
    `;
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector("#formCliente");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nombre = this.shadowRoot.querySelector("#nombreCliente").value.trim();
      const cedula = this.shadowRoot.querySelector("#cedulaCliente").value.trim();
      const direccion = this.shadowRoot.querySelector("#direccionCliente").value.trim();

      if (nombre && cedula && direccion) {
        AgregarClienteService({ nombre, cedula, direccion });
        form.reset();
        this.renderTabla();
      }
    });

    this.shadowRoot.querySelector("#btnCancelarEdicion").addEventListener("click", () => {
      this.shadowRoot.querySelector("#modalEditar").close();
    });

    this.shadowRoot.querySelector("#btnGuardarEdicion").addEventListener("click", (e) => {
      e.preventDefault();
      const id = this.clienteEditandoId;
      const nombre = this.shadowRoot.querySelector("#editarNombre").value.trim();
      const cedula = this.shadowRoot.querySelector("#editarCedula").value.trim();
      const direccion = this.shadowRoot.querySelector("#editarDireccion").value.trim();

      if (id && nombre && cedula && direccion) {
        ActualizarClienteService(id, { nombre, cedula, direccion });
        this.shadowRoot.querySelector("#modalEditar").close();
        this.renderTabla();
      }
    });
  }

  renderTabla() {
    const tbody = this.shadowRoot.querySelector("#tbodyClientes");
    const clientes = ObtenerTodosClientesService();

    tbody.innerHTML = clientes.map(c => `
      <tr>
        <td class="border p-2">${c.nombre}</td>
        <td class="border p-2">${c.cedula}</td>
        <td class="border p-2">${c.direccion}</td>
        <td class="border p-2 space-x-2 text-center">
          <button data-id="${c.id}" class="btnEditar bg-yellow-400 text-white px-3 py-1 rounded">Editar</button>
          <button data-id="${c.id}" class="btnEliminar bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
        </td>
      </tr>
    `).join("");

    this.shadowRoot.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        EliminarClienteService(id);
        this.renderTabla();
      });
    });

    this.shadowRoot.querySelectorAll(".btnEditar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const cliente = ObtenerClientePorIdService(id);
        if (cliente) {
          this.clienteEditandoId = id;
          this.shadowRoot.querySelector("#editarNombre").value = cliente.nombre;
          this.shadowRoot.querySelector("#editarCedula").value = cliente.cedula;
          this.shadowRoot.querySelector("#editarDireccion").value = cliente.direccion;
          this.shadowRoot.querySelector("#modalEditar").showModal();
        }
      });
    });

    this.shadowRoot.querySelector("#btnGuardarEdicion").addEventListener("click", (e) => {
    e.preventDefault();
    const id = this.clienteEditandoId;
    const nombre = this.shadowRoot.querySelector("#editarNombre").value.trim();
    const cedula = this.shadowRoot.querySelector("#editarCedula").value.trim();
    const direccion = this.shadowRoot.querySelector("#editarDireccion").value.trim();

    if (id && nombre && cedula && direccion) {
        ActualizarClienteService(id, { nombre, cedula, direccion });
        this.shadowRoot.querySelector("#modalEditar").close();
        this.renderTabla();
    }
    });

  }
}

customElements.define("cliente-element", ClienteElement);
