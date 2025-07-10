class InicioElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          text-align: center;
          color: #2563eb;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.25rem;
          color: #374151;
        }
      </style>
      <h1>Bienvenido a Mi Proyecto</h1>
      <p>Este es el panel de inicio. Aquí puedes gestionar clientes, productos y facturas.</p>
    `;
  }
}

customElements.define("inicio-element", InicioElement);
