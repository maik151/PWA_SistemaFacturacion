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
      <link href="/public/styles/css/bootstrap.min.css" rel="stylesheet" />
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 2rem;
          text-align: center;
          color: #0d6efd; /* color primary bootstrap */
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.25rem;
          color: #495057; /* texto secundario bootstrap */
        }
      </style>

      <div class="container">
        <h1>Bienvenido a Mi Proyecto</h1>
        <p>Nombre: Michael Steven Jimenez Basante</p>
        <p>Programacion de Componentes Web</p>
        
        <p>Este es el panel de inicio. Aquí puedes gestionar clientes, productos y facturas.</p>
      </div>
    `;
  }
}

customElements.define("inicio-element", InicioElement);
