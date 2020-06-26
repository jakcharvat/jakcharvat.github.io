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
    }
    initRow(projects) {
        this.initNameTF();
        this.getTags(projects);
        this.classList.add('shown');
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
}
customElements.define('filter-row', FilterRow);
export default FilterRow;
