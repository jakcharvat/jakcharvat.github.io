var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FilterTextfield extends HTMLElement {
    constructor(onchane) {
        super();
        this.setup(onchane);
    }
    setup(onchange) {
        return __awaiter(this, void 0, void 0, function* () {
            this.attachShadow({ mode: "open" });
            this.changeHandler = onchange;
            const styleEl = document.createElement('style');
            styleEl.innerHTML = yield this.getStyle();
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
        });
    }
    getStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch('../../styles/build/filter-tf-styles.css');
            return yield res.text();
        });
    }
    init() {
        let placeholderText = this.inputElement.getAttribute('placeholder');
        if (placeholderText) {
            this.containerElement.setAttribute('data-label', placeholderText);
            this.inputElement.classList.add('label-hidden');
        }
        this.inputElement.oninput = _ => {
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
