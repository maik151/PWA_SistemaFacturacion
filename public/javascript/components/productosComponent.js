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
    this.productoEditandoId = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.renderTabla();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link href="/public/styles/css/bootstrap.min.css" rel="stylesheet">
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
        <h2 class="mb-4 text-primary text-center fw-bold">Gestión de Productos</h2>

        <form id="formProducto" class="mb-4">
          <div class="mb-3">
            <input type="text" id="nombreProducto" placeholder="Nombre del producto" required class="form-control" />
          </div>
          <div class="mb-3">
            <input type="number" step="0.01" id="precioProducto" placeholder="Precio" required class="form-control" />
          </div>
          <button type="submit" class="btn btn-success w-100">Guardar Producto</button>
        </form>

        <h3 class="mb-3">Listado de Productos</h3>
        <div class="table-responsive">
          <table class="table table-bordered table-striped rounded-3">
            <thead class="table-light">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th class="text-center" style="width: 130px;">Acciones</th>
              </tr>
            </thead>
            <tbody id="tbodyProductos"></tbody>
          </table>
        </div>

        <!-- Modal para edición -->
        <dialog id="modalEditar" class="rounded-3 p-0 border-0 shadow-lg">
          <form method="dialog" class="p-4 bg-white rounded-3" style="width: 350px; max-width: 90vw;">
            <h4 class="mb-3 fw-bold">Editar Producto</h4>
            <div class="mb-3">
              <input type="text" id="editarNombre" class="form-control" placeholder="Nombre del producto" />
            </div>
            <div class="mb-3">
              <input type="number" step="0.01" id="editarPrecio" class="form-control" placeholder="Precio" />
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
    const form = this.shadowRoot.querySelector("#formProducto");
    const modal = this.shadowRoot.querySelector("#modalEditar");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = this.shadowRoot.querySelector("#nombreProducto").value.trim();
      const precio = parseFloat(this.shadowRoot.querySelector("#precioProducto").value);

      if (nombre && !isNaN(precio)) {
        AgregarProductoService({ nombre, precio });
        form.reset();
        this.renderTabla();
      }
    });

    // Cerrar modal al hacer clic fuera del modal (backdrop)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.close();
    });

    this.shadowRoot.querySelector("#btnCancelarEdicion").addEventListener("click", () => {
      modal.close();
    });

    this.shadowRoot.querySelector("#btnGuardarEdicion").addEventListener("click", (e) => {
      e.preventDefault();
      const id = this.productoEditandoId;
      const nombre = this.shadowRoot.querySelector("#editarNombre").value.trim();
      const precio = parseFloat(this.shadowRoot.querySelector("#editarPrecio").value);

      if (id && nombre && !isNaN(precio)) {
        ActualizarProductoService(id, { nombre, precio });
        modal.close();
        this.renderTabla();
      }
    });
  }

  renderTabla() {
    const tbody = this.shadowRoot.querySelector("#tbodyProductos");
    const productos = ObtenerTodosProductosService();

    tbody.innerHTML = productos.map(p => {
      const nombre = p.nombre ?? "Sin nombre";
      const precio = (typeof p.precio === "number") ? `$${p.precio.toFixed(2)}` : "$0.00";

      return `
        <tr>
          <td>${nombre}</td>
          <td>${precio}</td>
          <td class="text-center">
            <button data-id="${p.id}" class="btnEditar btn btn-warning btn-sm me-1">Editar</button>
            <button data-id="${p.id}" class="btnEliminar btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");

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
          this.productoEditandoId = id;
          this.shadowRoot.querySelector("#editarNombre").value = producto.nombre ?? "";
          this.shadowRoot.querySelector("#editarPrecio").value = producto.precio ?? 0;
          this.shadowRoot.querySelector("#modalEditar").showModal();
        }
      });
    });
  }
}

customElements.define("producto-element", ProductoElement);
