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
      <link href="./styles/css/bootstrap.min.css" rel="stylesheet">
      <script src="./styles/js/bootstrap.bundle.min.js"></script>

      <style>
        :host { display: block; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        dialog::backdrop {
          background-color: rgba(0,0,0,0.5);
        }
        dialog {
          border: none;
          border-radius: 0.5rem;
          max-width: 400px;
          padding: 1.5rem;
        }
      </style>

      <div class="container py-4">
        <h2 class="mb-4 text-center text-primary fw-bold">Gestión de Productos</h2>

        <form id="formProducto" class="mb-4">
          <div class="mb-3">
            <input type="text" id="nombreProducto" placeholder="Nombre del producto" required class="form-control" />
          </div>
          <div class="mb-3">
            <input type="number" step="0.01" id="precioProducto" placeholder="Precio" required class="form-control" />
          </div>
          <button type="submit" class="btn btn-primary w-100">Guardar Producto</button>
        </form>

        <h3 class="mb-3">Listado de Productos</h3>
        <div class="table-responsive rounded shadow-sm border">
          <table class="table table-striped table-bordered mb-0">
            <thead class="table-light">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th class="text-center" style="width: 140px;">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbodyProductos"></tbody>
          </table>
        </div>
      </div>

      <!-- Modal edición Bootstrap nativo -->
      <dialog id="modalEditar">
        <form method="dialog" class="d-flex flex-column gap-3">
          <h4 class="fw-bold mb-3 text-center">Editar Producto</h4>
          <input type="text" id="editarNombre" class="form-control" />
          <input type="number" step="0.01" id="editarPrecio" class="form-control" />
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" id="btnCancelarEdicion" class="btn btn-secondary">Cancelar</button>
            <button type="submit" id="btnGuardarEdicion" class="btn btn-success">Guardar</button>
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
        <td>${p.nombre}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td class="text-center">
          <button data-id="${p.id}" class="btn btn-sm btn-warning me-2 btnEditar">Editar</button>
          <button data-id="${p.id}" class="btn btn-sm btn-danger btnEliminar">Eliminar</button>
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
