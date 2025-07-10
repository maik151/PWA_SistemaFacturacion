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
      
      <link href="./styles/css/bootstrap.min.css" rel="stylesheet">

      <style>
        :host {
          display: flex;
          height: 100vh;
          font-family: 'Inter', sans-serif;
          background: #f9fafb;
        }

        aside {
          width: 220px;
          background: white;
          border-radius: 1rem;
          border: 1px solid #dee2e6;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          box-shadow: 0 8px 24px rgb(0 0 0 / 0.1);
          margin: 1rem;
        }

        aside h1 {
          font-size: 1.75rem;
          font-weight: 900;
          margin-bottom: 2rem;
          color: #0d6efd;
          text-align: center;
          user-select: none;
          letter-spacing: 1px;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        nav button {
          width: 100%;
          padding: 0.75rem 1rem;
          font-weight: 600;
          border-radius: 1rem;
          border: 1.5px solid transparent;
          background: #f8f9fa;
          color: #495057;
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);
          transition: 
            background-color 0.3s ease, 
            border-color 0.3s ease, 
            color 0.3s ease,
            box-shadow 0.3s ease;
          cursor: pointer;
          text-align: center;
        }

        nav button:hover {
          background-color: #e7f1ff;
          border-color: #0d6efd;
          color: #0d6efd;
        }

        nav button.active {
          background-color: #0d6efd;
          border-color: #0a58ca;
          color: white;

        }

        main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background: #f8f9fa;
          border-radius: 1rem;
          margin: 1rem;
          box-shadow: 0 8px 24px rgb(0 0 0 / 0.1);
        }

        /* Responsive: en pantallas pequeñas, sidebar horizontal */
        @media (max-width: 768px) {
          :host {
            flex-direction: column;
          }
          aside {
            width: 100%;
            border-radius: 0 0 1rem 1rem;
            margin: 0;
            padding: 1rem;
            flex-direction: row;
            overflow-x: auto;
            box-shadow: none;
            border-bottom: 1px solid #dee2e6;
          }
          aside h1 {
            flex: 0 0 auto;
            font-size: 1.25rem;
            margin: 0 1rem 0 0;
            align-self: center;
          }
          nav {
            flex-direction: row;
            gap: 0.75rem;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-right: 0.5rem;
          }
          nav button {
            flex: 0 0 auto;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            border-radius: 1rem;
            box-shadow: none;
            border: none;
            background: transparent;
            color: #495057;
            transition: color 0.3s ease;
          }
          nav button:hover {
            color: #0d6efd;
            background: transparent;
            box-shadow: none;
            border: none;
          }
          nav button.active {
            color: #0d6efd;
            font-weight: 700;
            background: transparent;
            border: none;
            box-shadow: none;
          }
          main {
            margin: 1rem 0;
            border-radius: 0;
            box-shadow: none;
            padding: 1rem;
          }
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

      <!-- Bootstrap JS Bundle (con Popper) -->
      <script src="../styles/js/bootstrap.bundle.min.js"></script>

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
