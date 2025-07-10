class AsideBarElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentTab = "inicio"; // pestaña por defecto ahora es "inicio"
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.showCurrentTab();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
        :host {
          display: flex;
          height: 100vh;
          font-family: 'Inter', sans-serif;
          background: #f9fafb;
        }
        aside {
          width: 220px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          box-shadow: 2px 0 5px rgb(0 0 0 / 0.05);
        }
        aside h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #2563eb;
          text-align: center;
          user-select: none;
        }
        nav button {
          width: 100%;
          text-align: left;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #374151;
          transition: background-color 0.3s, color 0.3s;
        }
        nav button:hover {
          background: #e0e7ff;
          color: #1e40af;
        }
        nav button.active {
          background: #2563eb;
          color: white;
        }
        main {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          background: #f3f4f6;
        }
      </style>

      <aside>
        <h1>Panel Admin</h1>
        <nav>
          <button data-tab="inicio" class="active">Inicio</button>
          <button data-tab="clientes">Clientes</button>
          <button data-tab="productos">Productos</button>
          <button data-tab="facturas">Facturas</button>
        </nav>
      </aside>

      <main id="mainContent">
        <!-- Aquí se cargan los componentes dinámicamente -->
      </main>
    `;
  }

  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll("nav button");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentTab = btn.getAttribute("data-tab");
        this.updateActiveButton();
        this.showCurrentTab();
      });
    });
  }

  updateActiveButton() {
    const buttons = this.shadowRoot.querySelectorAll("nav button");
    buttons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.currentTab);
    });
  }

  showCurrentTab() {
    const main = this.shadowRoot.querySelector("#mainContent");
    main.innerHTML = "";

    let componente;
    switch (this.currentTab) {
      case "inicio":
        componente = document.createElement("inicio-element");
        break;
      case "clientes":
        componente = document.createElement("cliente-element");
        break;
      case "productos":
        componente = document.createElement("producto-element");
        break;
      case "facturas":
        componente = document.createElement("facturacion-element");
        break;
      default:
        componente = document.createElement("div");
        componente.textContent = "No se encontró el componente";
    }

    main.appendChild(componente);
  }
}

customElements.define("aside-bar-element", AsideBarElement);
