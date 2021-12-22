import { createElement } from "./dom-manipulations.js";
class TagsWindow extends HTMLElement {
    constructor() {
        super(...arguments);
        this._filteredTags = new Set();
        this._windowHeight = 0;
        this._windowWidth = 0;
    }
    set projects(projects) {
        this._projects = projects;
    }
    set tags(tags) {
        this._tags = tags;
        this._tagElements = tags.map(tag => {
            let el = new TagElement();
            el.label = tag;
            el.onfilter = (label, isOn) => this.tagChanged(label, isOn);
            return el;
        });
        const overlay = createElement('div', 'overlay');
        const window = createElement('div', 'window');
        const title = document.createElement('h2');
        title.innerHTML = 'Showing all projects';
        this._showAllButton = document.createElement('button');
        this._showAllButton.innerHTML = 'clear filters';
        const titleRow = createElement('div', 'title-row');
        titleRow.appendChild(title);
        titleRow.appendChild(this._showAllButton);
        const tagsContainer = createElement('div', 'tags-container');
        this._tagElements.forEach(tag => tagsContainer.appendChild(tag));
        window.appendChild(titleRow);
        window.appendChild(tagsContainer);
        this.appendChild(overlay);
        this.appendChild(window);
        this._title = title;
        this._showAllButton.onclick = e => {
            for (const tag of this._tagElements) {
                tag.isOn = false;
            }
            this._filteredTags = new Set();
            this.updateTagsUI();
        };
    }
    setupListeners() {
        const button = document.getElementById('filterTagsButton');
        const overlay = Array.from(this.children).filter(el => el.classList.contains('overlay'))[0];
        const window = Array.from(this.children).filter(el => el.classList.contains('window'))[0];
        button.onclick = e => {
            const buttonRect = button.getBoundingClientRect();
            const windowStyle = globalThis.window.getComputedStyle(window);
            let x = buttonRect.x;
            let y = buttonRect.y;
            const endWindowRight = x + this._windowWidth;
            const endWindowBottom = y + this._windowHeight;
            const maxWindowRight = globalThis.window.innerWidth - 20;
            const maxWindowBottom = globalThis.window.innerHeight - 20;
            if (endWindowRight > maxWindowRight) {
                const overflow = endWindowRight - maxWindowRight;
                x -= overflow;
            }
            if (endWindowBottom > maxWindowBottom) {
                const overflow = endWindowBottom - maxWindowBottom;
                y -= overflow;
            }
            window.style.left = `${x}px`;
            window.style.top = `${y}px`;
            this.classList.add('display-shown');
            setTimeout(() => {
                this.classList.add('shown');
            }, 10);
        };
        overlay.onclick = e => {
            this.classList.remove('shown');
            setTimeout(() => {
                this.classList.remove('display-shown');
            }, 300);
        };
    }
    tagChanged(label, isOn) {
        if (isOn) {
            this._filteredTags.add(label);
        }
        else {
            this._filteredTags.delete(label);
        }
        this.updateTagsUI();
    }
    updateTagsUI() {
        if (this._filteredTags.size === 0) {
            this._title.innerHTML = 'Showing all projects';
            this._tagElements.forEach(el => el.isDimmed = false);
            this._showAllButton.classList.remove('shown');
        }
        else {
            const tagCount = this._filteredTags.size;
            this._title.innerHTML = `Filtering ${tagCount} ${tagCount === 1 ? 'tag' : 'tags'}`;
            this._tagElements.forEach(el => el.isDimmed = !this._filteredTags.has(el._label));
            this._showAllButton.classList.add('shown');
        }
        this._onfilter(Array.from(this._filteredTags));
    }
    set onfilter(callback) {
        this._onfilter = callback;
    }
    getHeight() {
        this.className = 'opacity-hidden shown display-shown';
        const rect = this.children[1].getBoundingClientRect();
        this._windowHeight = rect.height;
        this._windowWidth = rect.width;
        this.className = '';
    }
}
class TagElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this._label = '';
        this._isOn = false;
        this._isDimmed = false;
    }
    set label(label: string) {
        this._label = label;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `${label}Checkbox`;
        checkbox.id = checkbox.name;
        checkbox.className = 'filter-checkbox';
        const labelEl = document.createElement('label');
        labelEl.htmlFor = `${label}Checkbox`;
        labelEl.innerHTML = label.toLowerCase();
        this.appendChild(checkbox);
        this.appendChild(labelEl);
        this._checkbox = checkbox;
        this.setupListeners();
    }
    set onfilter(callback) {
        this._onfilter = callback;
    }
    set isDimmed(isDimmed) {
        this._isDimmed = isDimmed;
        if (isDimmed) {
            this.classList.add('dimmed');
        }
        else {
            this.classList.remove('dimmed');
        }
    }
    set isOn(isOn) {
        this._isOn = isOn;
        this.updateUI();
    }
    setupListeners() {
        this.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            this._isOn = !this._isOn;
            this.updateUI();
        };
    }
    updateUI() {
        this._checkbox.checked = this._isOn;
        this._onfilter(this._label, this._isOn);
    }
}
customElements.define('tags-window', TagsWindow);
customElements.define('tag-element', TagElement);
export default TagsWindow;
