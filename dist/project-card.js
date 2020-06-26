import { createElement } from './dom-manipulations.js';
export default class ProjectCard extends HTMLElement {
    constructor() {
        super(...arguments);
        this._matchesTag = true;
        this._matchesQuery = true;
    }
    set project(project) {
        var _a;
        this._project = project;
        /**
         * The code below creates the following markup:
         *
         * <div class="project">
         *     <div class="project-image">
         *         <img src="images/${project.lowResImage}" class="lowres">
         *     </div>
         *     <div class="project-detail-col">
         *         <div class="project-detail-col--top-aligned">
         *             <div class="project-detail-row project-detail-row--title">
         *                 <a href="${project.url}" class="project-title">${project.title}</a>
         *                 <a href="${project.repoURL}">Repo</a>
         *             </div>
         *             <p>${project.description}</p>
         *         </div>
         *         <div class="project-detail-row project-detail-row--tags">${tags}</div>
         *     </div>
         * </div>
         *
         */
        const tags = (_a = project.tags, (_a !== null && _a !== void 0 ? _a : [])).map(tag => {
            const tagEl = createElement('div', 'project-tag');
            tagEl.innerHTML = tag;
            return tagEl;
        });
        const projectEl = createElement('div', 'project');
        this.imageContainerEl = createElement('div', 'project-image');
        this.lowResImageEl = createElement('img', 'lowres');
        this.lowResImageEl.src = `images/${project.lowResImage}`;
        this.imageContainerEl.appendChild(this.lowResImageEl);
        const projectInfoCol = createElement('div', 'project-detail-col');
        const textCol = createElement('div', 'project-info-col--top-aligned');
        const titleRow = createElement('div', 'project-detail-row project-detail-row--title');
        const title = createElement('a', 'project-title');
        const repo = createElement('a', '');
        title.href = project.url;
        title.innerHTML = project.title;
        repo.href = project.repoURL;
        repo.innerHTML = 'Repo';
        [title, repo].forEach(el => titleRow.appendChild(el));
        const description = createElement('p', '');
        description.innerHTML = project.description;
        [titleRow, description].forEach(el => textCol.appendChild(el));
        const tagsContainer = createElement('div', 'project-detail-row project-detail-row--tags');
        tags.forEach(tag => tagsContainer.appendChild(tag));
        [textCol, tagsContainer].forEach(el => projectInfoCol.appendChild(el));
        [this.imageContainerEl, projectInfoCol].forEach(el => projectEl.appendChild(el));
        this.appendChild(projectEl);
    }
    fetchFullResImage() {
        const imgName = this._project.highResImage;
        const imgEl = new Image();
        imgEl.onload = () => {
            setTimeout(() => {
                imgEl.classList.add('shown');
                this.lowResImageEl.classList.add('hidden');
                setTimeout(() => this.lowResImageEl.remove(), 300);
            }, 10);
        };
        imgEl.src = `images/${imgName}`;
        imgEl.className = 'highres';
        this.imageContainerEl.appendChild(imgEl);
    }
    set matchesTag(matches) {
        this._matchesTag = matches;
        this.updateVisibility();
    }
    set matchesQuery(matches) {
        this._matchesQuery = matches;
        this.updateVisibility();
    }
    updateVisibility() {
        if (this._matchesQuery && this._matchesTag) {
            this.classList.remove('hidden');
        }
        else if (!this.classList.contains('hidden')) {
            this.classList.add('hidden');
        }
    }
}
customElements.define('project-card', ProjectCard);
