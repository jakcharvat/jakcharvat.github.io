import style from './filter-textfield-style.js';
class FilterTextfield extends HTMLElement {
    constructor(onchane) {
        super();
        this.attachShadow({ mode: "open" });
        this.changeHandler = onchane;
        const styleEl = document.createElement('style');
        styleEl.innerHTML = style;
        const container = document.createElement('div');
        container.id = 'nameTFContainer';
        this.containerElement = container;
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'nameTF';
        input.id = 'nameTF';
        input.placeholder = 'Search';
        input.autocomplete = 'off';
        this.inputElement = input;
        this.shadowRoot.appendChild(styleEl);
        container.appendChild(input);
        this.shadowRoot.appendChild(container);
        this.init();
    }
    init() {
        let placeholderText = this.inputElement.getAttribute('placeholder');
        if (placeholderText) {
            this.containerElement.setAttribute('data-label', placeholderText);
            this.inputElement.classList.add('label-hidden');
        }
        this.inputElement.oninput = e => {
            if (this.inputElement.value.trim() === '') {
                this.inputElement.value = this.inputElement.value.trim();
                this.containerElement.classList.remove('has-input');
                this.changeHandler();
            }
            else {
                if (!this.classList.contains('has-input')) {
                    this.classList.add('has-input');
                }
                this.changeHandler(this.inputElement.value);
            }
        };
    }
}
customElements.define('filter-textfield', FilterTextfield);
export default FilterTextfield;
