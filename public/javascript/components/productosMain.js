import {
  obtenerTodosLosProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
} from "../modulos/productos.js";

let modoEdicion = false;
let productoEditandoId = null;

function inicializarModuloProductos() {
  const formProducto = document.getElementById("formProducto");
  const inputNombre = document.getElementById("nombreProducto");
  const inputPrecio = document.getElementById("precioProducto");
  const tablaProductosBody = document.querySelector("#tablaProductos tbody");

  // Función para renderizar la tabla
  function renderizarTabla() {
    const productos = obtenerTodosLosProductos();
    tablaProductosBody.innerHTML = "";

    productos.forEach(producto => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.precio.toFixed(2)}</td>
        <td>
          <button class="btn-editar" data-id="${producto.id}">Editar</button>
          <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        </td>
      `;

      tablaProductosBody.appendChild(fila);
    });

    // Añadir eventos a botones
    tablaProductosBody.querySelectorAll(".btn-editar").forEach(boton => {
      boton.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        iniciarEdicionProducto(id);
      });
    });

    tablaProductosBody.querySelectorAll(".btn-eliminar").forEach(boton => {
      boton.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm("¿Está seguro de eliminar este producto?")) {
          eliminarProducto(id);
          renderizarTabla();
          if (modoEdicion && productoEditandoId === id) {
            resetearFormulario();
          }
        }
      });
    });
  }

  // Iniciar edición cargando datos en el formulario
  function iniciarEdicionProducto(id) {
    const producto = obtenerTodosLosProductos().find(p => p.id === id);
    if (!producto) return;

    inputNombre.value = producto.nombre;
    inputPrecio.value = producto.precio;
    modoEdicion = true;
    productoEditandoId = id;
    formProducto.querySelector("button[type='submit']").textContent = "Actualizar Producto";
  }

  // Resetear formulario a modo nuevo
  function resetearFormulario() {
    formProducto.reset();
    modoEdicion = false;
    productoEditandoId = null;
    formProducto.querySelector("button[type='submit']").textContent = "Guardar Producto";
  }

  // Evento submit del formulario
  formProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);

    if (!nombre || isNaN(precio) || precio < 0) {
      alert("Por favor, ingrese un nombre válido y un precio positivo.");
      return;
    }

    if (modoEdicion) {
      // Actualizar producto existente
      actualizarProducto(productoEditandoId, nombre, precio);
      alert("Producto actualizado correctamente.");
    } else {
      // Agregar nuevo producto
      agregarProducto({ nombre, precio });
      alert("Producto agregado correctamente.");
    }

    renderizarTabla();
    resetearFormulario();
  });

  // Render inicial
  renderizarTabla();
}

export { inicializarModuloProductos };
