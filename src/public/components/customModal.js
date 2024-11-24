class customModal extends HTMLElement {
    constructor () {
        super();
        this.attachShadow( { mode: 'open' });
    }
    // Método para inicializar y renderizar el contenido del modal
    connectedCallback() {
        this.render(); // Llamar al método render
        this._initializeModal(); // Inicializar el modal de Bootstrap
    }

    // Getter y Setter para el título
    get title() {
      return this.getAttribute('title');
    }

    set title(value) {
      this.setAttribute('title', value);
      this._updateTitle(value); // Actualizar el título en el modal
    }

    // Getter y Setter para el mensaje
    get message() {
        return this.getAttribute('message');
      }

    set message(value) {
      this.setAttribute('message', value);
      this._updateMessage(value); // Actualizar el mensaje en el modal
    }

    // Cambios de atributos observados
    static get observedAttributes() {
      return ['title', 'message'];
    }

    // Cuando cambian los atributos
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'title') {
        this._updateTitle(newValue);
      } else if (name === 'message') {
        this._updateMessage(newValue);
      }
    }
    // Renderizar el contenido HTML y CSS del modal
    render() {
        this.shadowRoot.innerHTML = `
          <div class="modal fade" style="display: none;" tabindex="-1" data-bs-backdrop="static" aria-hidden="true">
           <div class="modal-dialog modal-dialog-centered modal-sm" style="border-radius: 2px;">
            <div class="modal-content">
            <div class="modal-body border border-secondary" style="background-color: #17171c;">
          <div class="container-fluid">
          <div class="row">
            <div class="text-center">
              <i class="fa-solid fa-triangle-exclamation" style="color: rgb(244, 197, 5); font-size: 80px;"></i>
            </div>
            <div class="py-3" style="color: white;">
              <div class="text-center">
                <h2 id="_modalTitle"></h2>
              </div>
              <div class="text-center">
                <strong id="_modalMessage"></strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer border border-secondary" style="background-color:  #5dade2">
            <button type="button" class="btn btn-danger mx-auto w-30px" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary mx-auto w-30px" data-bs-dismiss="modal"
              id="btn-aceptar-customModal">Aceptar</button>
          </div>
          </div>
        </div>
      </div>`;
    }
    // Inicializar el modal de Bootstrap
    _initializeModal() {
      this._modalElement = this.shadowRoot.querySelector('.modal');
      this._modal = new bootstrap.Modal(this._modalElement);
    }

    // Mostrar el modal
    show() {
      this._modal.show();
    }

    // Ocultar el modal
    hide() {
      this._modal.hide();
    }

    // Actualizar el título en el modal
    _updateTitle(title) {
      const titleElement = this.shadowRoot.querySelector('#_modalTitle');
      if (titleElement) {
          titleElement.textContent = title;
      }
    }
    // Actualizar el mensaje en el modal
    _updateMessage(message) {
      const messageElement = this.shadowRoot.querySelector('#_modalMessage');
      if (messageElement) {
        messageElement.textContent = message;
      }
    }
}

customElements.define('custom-modal', customModal);