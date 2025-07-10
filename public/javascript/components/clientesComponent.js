import {
  ObtenerTodosClientesService,
  ObtenerClientePorIdService,
  AgregarClienteService,
  ActualizarClienteService,
  EliminarClienteService
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
      <link href="./styles/css/bootstrap.min.css" rel="stylesheet">
      <script src="./styles/js/bootstrap.bundle.min.js"></script>

      <style>
        :host {
          display: block;
          font-family: sans-serif;
          background: #f8f9fa;
          padding: 2rem;
        }

        .card {
          max-width: 700px;
          margin: 0 auto;
          border-radius: 1rem;
          box-shadow: 0 4px 15px rgb(0 0 0 / 0.1);
        }

        dialog::backdrop {
          background: rgba(0,0,0,0.5);
        }

        #modalEditar:not([open]) {
          display: none;
        }
      </style>

      <div class="card p-4 bg-white">
        <h2 class="mb-4 text-primary text-center fw-bold">Gestión de Clientes</h2>

        <form id="formCliente" class="mb-4">
          <div class="mb-3">
            <input type="text" id="nombreCliente" placeholder="Nombre" required class="form-control" />
          </div>
          <div class="mb-3">
            <input type="text" id="cedulaCliente" placeholder="Cédula" required class="form-control" />
          </div>
          <div class="mb-3">
            <input type="text" id="direccionCliente" placeholder="Dirección" required class="form-control" />
          </div>
          <button type="submit" class="btn btn-success w-100">Guardar Cliente</button>
        </form>

        <h3 class="mb-3">Listado de Clientes</h3>
        <div class="table-responsive">
          <table class="table table-bordered table-striped rounded-3">
            <thead class="table-light">
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Dirección</th>
                <th class="text-center" style="width: 130px;">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbodyClientes"></tbody>
          </table>
        </div>

        <!-- Modal para edición -->
        <dialog id="modalEditar" class="rounded-3 p-0 border-0 shadow-lg">
          <form method="dialog" class="p-4 bg-white rounded-3" style="width: 350px; max-width: 90vw;">
            <h4 class="mb-3 fw-bold">Editar Cliente</h4>
            <div class="mb-3">
              <input type="text" id="editarNombre" class="form-control" placeholder="Nombre" />
            </div>
            <div class="mb-3">
              <input type="text" id="editarCedula" class="form-control" placeholder="Cédula" />
            </div>
            <div class="mb-3">
              <input type="text" id="editarDireccion" class="form-control" placeholder="Dirección" />
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button type="button" id="btnCancelarEdicion" class="btn btn-secondary">Cancelar</button>
              <button type="submit" id="btnGuardarEdicion" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </dialog>
      </div>
    `;

    // Cerrar modal si está abierto por defecto
    this.shadowRoot.querySelector("#modalEditar").close();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector("#formCliente");
    const modal = this.shadowRoot.querySelector("#modalEditar");

    form.addEventListener("submit", (e) => {
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

    // Cerrar modal al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.close();
    });

    this.shadowRoot.querySelector("#btnCancelarEdicion").addEventListener("click", () => {
      modal.close();
    });

    this.shadowRoot.querySelector("#btnGuardarEdicion").addEventListener("click", (e) => {
      e.preventDefault();
      const id = this.clienteEditandoId;
      const nombre = this.shadowRoot.querySelector("#editarNombre").value.trim();
      const cedula = this.shadowRoot.querySelector("#editarCedula").value.trim();
      const direccion = this.shadowRoot.querySelector("#editarDireccion").value.trim();

      if (id && nombre && cedula && direccion) {
        ActualizarClienteService(id, { nombre, cedula, direccion });
        modal.close();
        this.renderTabla();
      }
    });
  }

  renderTabla() {
    const tbody = this.shadowRoot.querySelector("#tbodyClientes");
    const clientes = ObtenerTodosClientesService();

    tbody.innerHTML = clientes.map(c => `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.cedula}</td>
        <td>${c.direccion}</td>
        <td class="text-center">
          <button data-id="${c.id}" class="btnEditar btn btn-warning btn-sm me-1">Editar</button>
          <button data-id="${c.id}" class="btnEliminar btn btn-danger btn-sm">Eliminar</button>
        </td>
      </tr>
    `).join("");

    // Botones eliminar
    this.shadowRoot.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        EliminarClienteService(id);
        this.renderTabla();
      });
    });

    // Botones editar
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
  }
}

customElements.define("cliente-element", ClienteElement);
