import {
  agregarCliente,
  obtenerTodosLosClientes,
  eliminarCliente,
  actualizarCliente
} from "../modulos/clientes.js";

export function inicializarModuloClientes() {
  console.log("Inicializado módulo clientes");

  // Cachear selectores DOM
  const formCliente = document.getElementById("formCliente");
  const tbodyClientes = document.querySelector("#tablaClientes tbody");
  const btnRecargarClientes = document.getElementById("btnRecargarClientes");

  // Contenedor para mensajes de error/éxito
  let mensajeContenedor = document.createElement("div");
  mensajeContenedor.id = "mensajeCliente";
  mensajeContenedor.style.margin = "10px 0";
  mensajeContenedor.style.color = "red";
  formCliente.parentNode.insertBefore(mensajeContenedor, formCliente.nextSibling);

  // Estado para controlar si hay una fila en edición
  let filaEnEdicion = null;

  // Mostrar mensajes (error o éxito)
  function mostrarMensaje(texto, esError = true) {
    mensajeContenedor.textContent = texto;
    mensajeContenedor.style.color = esError ? "red" : "green";
    setTimeout(() => {
      mensajeContenedor.textContent = "";
    }, 4000);
  }

  // Crear inputs para edición en una fila
  function crearInputsEdicion(fila, valores) {
    fila.querySelector(".nombre").innerHTML = `<input type="text" value="${valores.nombre}" />`;
    fila.querySelector(".cedula").innerHTML = `<input type="text" value="${valores.cedula}" />`;
    fila.querySelector(".direccion").innerHTML = `<input type="text" value="${valores.direccion}" />`;
  }

  // Restaurar fila a modo no edición con valores dados
  function restaurarFila(fila, valores) {
    fila.querySelector(".nombre").textContent = valores.nombre;
    fila.querySelector(".cedula").textContent = valores.cedula;
    fila.querySelector(".direccion").textContent = valores.direccion;
    fila.querySelector("td:last-child").innerHTML = `
      <button class="btnEditar" data-id="${fila.dataset.id}">Editar</button>
      <button class="btnEliminar" data-id="${fila.dataset.id}">Eliminar</button>
    `;
  }

  // Cambiar botones a modo edición
  function activarBotonesEdicion(fila) {
    const tdAcciones = fila.querySelector("td:last-child");
    tdAcciones.innerHTML = `
      <button class="btnCancelar">❌</button>
      <button class="btnGuardar">✔️</button>
    `;
  }

  // Cargar la tabla con datos
  function cargarTablaClientes() {
    const clientes = obtenerTodosLosClientes();
    tbodyClientes.innerHTML = "";
    filaEnEdicion = null; // Reset estado edición

    clientes.forEach(cliente => {
      const fila = document.createElement("tr");
      fila.dataset.id = cliente.id;
      fila.innerHTML = `
        <td class="nombre">${cliente.nombre}</td>
        <td class="cedula">${cliente.cedula}</td>
        <td class="direccion">${cliente.direccion}</td>
        <td>
          <button class="btnEditar" data-id="${cliente.id}">Editar</button>
          <button class="btnEliminar" data-id="${cliente.id}">Eliminar</button>
        </td>
      `;
      tbodyClientes.appendChild(fila);
    });
  }

  // Delegación de eventos para botones editar, eliminar, cancelar, guardar
  tbodyClientes.addEventListener("click", (e) => {
    const fila = e.target.closest("tr");
    if (!fila) return;

    const id = parseInt(fila.dataset.id);

    if (e.target.classList.contains("btnEliminar")) {
      // Confirmar antes de eliminar
      if (filaEnEdicion) {
        mostrarMensaje("Termina o cancela la edición actual antes de eliminar.", true);
        return;
      }
      eliminarCliente(id);
      cargarTablaClientes();
      mostrarMensaje("Cliente eliminado.", false);

    } else if (e.target.classList.contains("btnEditar")) {
      if (filaEnEdicion) {
        mostrarMensaje("Ya hay una fila en edición. Termínala o cancélala antes.", true);
        return;
      }
      // Guardar valores originales para posible cancelación
      filaEnEdicion = {
        fila,
        valoresOriginales: {
          nombre: fila.querySelector(".nombre").textContent,
          cedula: fila.querySelector(".cedula").textContent,
          direccion: fila.querySelector(".direccion").textContent
        }
      };
      activarModoEdicion(fila);

    } else if (e.target.classList.contains("btnCancelar")) {
      if (!filaEnEdicion || filaEnEdicion.fila !== fila) return;
      // Restaurar valores originales
      restaurarFila(fila, filaEnEdicion.valoresOriginales);
      filaEnEdicion = null;

    } else if (e.target.classList.contains("btnGuardar")) {
      if (!filaEnEdicion || filaEnEdicion.fila !== fila) return;

      // Obtener valores nuevos
      const nuevoNombre = fila.querySelector(".nombre input").value.trim();
      const nuevaCedula = fila.querySelector(".cedula input").value.trim();
      const nuevaDireccion = fila.querySelector(".direccion input").value.trim();

      // Validación
      if (!nuevoNombre || !nuevaCedula || !nuevaDireccion) {
        mostrarMensaje("Todos los campos son obligatorios.", true);
        return;
      }

      // Actualizar datos
      actualizarCliente(id, nuevoNombre, nuevaCedula, nuevaDireccion);
      mostrarMensaje("Cliente actualizado correctamente.", false);
      cargarTablaClientes();
      filaEnEdicion = null;
    }
  });

  // Función que activa edición en una fila (solo la visual)
  function activarModoEdicion(fila) {
    const valores = {
      nombre: fila.querySelector(".nombre").textContent,
      cedula: fila.querySelector(".cedula").textContent,
      direccion: fila.querySelector(".direccion").textContent
    };
    crearInputsEdicion(fila, valores);
    activarBotonesEdicion(fila);
  }

  // Botón recargar tabla
  btnRecargarClientes.addEventListener("click", () => {
    if (filaEnEdicion) {
      mostrarMensaje("Cancela o guarda la edición actual antes de recargar.", true);
      return;
    }
    cargarTablaClientes();
  });

  // Submit formulario agregar cliente
  formCliente.addEventListener("submit", e => {
    e.preventDefault();

    if (filaEnEdicion) {
      mostrarMensaje("Termina la edición actual antes de agregar un nuevo cliente.", true);
      return;
    }

    const nombre = document.getElementById("nombreCliente").value.trim();
    const cedula = document.getElementById("cedulaCliente").value.trim();
    const direccion = document.getElementById("direccionCliente").value.trim();

    if (!nombre || !cedula || !direccion) {
      mostrarMensaje("Todos los campos son obligatorios.", true);
      return;
    }

    agregarCliente({ nombre, cedula, direccion });
    formCliente.reset();
    cargarTablaClientes();
    mostrarMensaje("Cliente agregado correctamente.", false);
  });

  // Carga inicial
  cargarTablaClientes();
}
