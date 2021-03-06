import TagsWindow from "./tags-window.js";
class FilterRow extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div id="nameTFContainer">
            <input type="text" name="nameTF" id="nameTF", placeholder="Search..." autocomplete="off">
        </div>
        <button id="filterTagsButton">Filter tags</button>
        `;
        window.addEventListener('resize', () => {
            this.onScroll();
        });
    }
    initRow(projects) {
        this.initNameTF();
        this.getTags(projects);
        this.classList.add('shown');
        // this.classList.add('stuck')
        this.initScrollListener();
    }
    initNameTF() {
        const container = document.getElementById('nameTFContainer');
        const tf = document.getElementById('nameTF');
        let placeholderText = tf.getAttribute('placeholder');
        if (placeholderText) {
            container.setAttribute('data-label', placeholderText);
            tf.classList.add('label-hidden');
        }
        tf.oninput = e => {
            if (tf.value.trim() === '') {
                tf.value = tf.value.trim();
                container.classList.remove('has-input');
                this.search();
            }
            else {
                if (!container.classList.contains('has-input')) {
                    container.classList.add('has-input');
                }
                this.search(tf.value);
            }
        };
    }
    search(query) {
        let projects = Array.from(document.getElementById('projectsGrid').children);
        if (query === undefined || query === null) {
            projects.forEach(project => project.matchesQuery = true);
            return;
        }
        projects.forEach(card => card.matchesQuery = card._project.matchesQuery(query));
    }
    filter(tags) {
        let projects = Array.from(document.getElementById('projectsGrid').children);
        if (tags.length === 0) {
            projects.forEach(project => project.matchesTag = true);
            return;
        }
        projects.forEach(card => card.matchesTag = card._project.matchesTags(tags));
    }
    getTags(projects) {
        const tagsRaw = ((projects !== null && projects !== void 0 ? projects : [])).reduce((acc, curr) => { var _a; return [...acc, ...(_a = curr.tags, (_a !== null && _a !== void 0 ? _a : []))]; }, []);
        const tags = Array.from(new Set(tagsRaw));
        const sortedTags = tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        this.createTagsWindow(sortedTags);
    }
    createTagsWindow(tags) {
        const tagsWindow = new TagsWindow();
        tagsWindow.tags = tags;
        tagsWindow.onfilter = (tags) => this.filter(tags);
        tagsWindow.setupListeners();
        document.body.appendChild(tagsWindow);
        tagsWindow.getHeight();
    }
    initScrollListener() {
        var _a;
        this._initialOffsetTop = this.offsetTop;
        this._initialParentOffsetTop = (_a = this._parent, (_a !== null && _a !== void 0 ? _a : this.parentElement)).offsetTop;
        window.onscroll = () => this.onScroll();
    }
    onScroll() {
        var _a;
        const parentOffsetTop = (_a = this._parent, (_a !== null && _a !== void 0 ? _a : this.parentElement)).offsetTop;
        const diff = this._initialParentOffsetTop - parentOffsetTop;
        const offset = (this._initialOffsetTop - diff) + parentOffsetTop;
        if (window.scrollY > offset - 12) {
            this.updateStuckPosition();
            if (this.classList.contains('stuck')) {
                return;
            }
            const height = this.getBoundingClientRect().height;
            const offset = height + parseInt(window.getComputedStyle(this).marginTop);
            document.getElementById('projectsGrid').style.marginTop = `${offset}px`;
            this.classList.add('stuck');
            this._parent = this.parentElement;
            this._parent.removeChild(this);
            document.body.appendChild(this);
            this.updateStuckPosition();
        }
        else {
            if (!this.classList.contains('stuck')) {
                return;
            }
            this.classList.remove('stuck');
            const grid = document.getElementById('projectsGrid');
            grid.style.marginTop = '0px';
            this.style.cssText = '';
            document.body.removeChild(this);
            this._parent.insertBefore(this, grid);
        }
    }
    updateStuckPosition() {
        const container = document.querySelector('.content.content--projects');
        const containerStyle = window.getComputedStyle(container);
        this.style.left = containerStyle.left;
        this.style.transform = containerStyle.transform;
        this.style.width = containerStyle.width;
        this.style.maxWidth = containerStyle.maxWidth;
    }
}
customElements.define('filter-row', FilterRow);
export default FilterRow;
