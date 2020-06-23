import { createElement } from './dom-manipulations.js'

export default class ProjectCard extends HTMLElement {
    _project: Project
    imageContainerEl: HTMLDivElement
    lowResImageEl: HTMLImageElement

    set project(project: Project) {
        this._project = project

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

        const tags = (project.tags ?? []).map(tag => {
            const tagEl = createElement('div', 'project-tag')
            tagEl.innerHTML = tag
            return tagEl
        })

        const projectEl = createElement('div', 'project')
        
        this.imageContainerEl = createElement('div', 'project-image') as HTMLDivElement
        this.lowResImageEl = createElement('img', 'lowres') as HTMLImageElement
        this.lowResImageEl.src = `images/${project.lowResImage}`
        this.imageContainerEl.appendChild(this.lowResImageEl)

        const projectInfoCol = createElement('div', 'project-detail-col')
        const textCol = createElement('div', 'project-info-col--top-aligned')
        
        const titleRow = createElement('div', 'project-detail-row project-detail-row--title')
        const title = createElement('a', 'project-title') as HTMLAnchorElement
        const repo = createElement('a', '') as HTMLAnchorElement
        
        title.href = project.url
        title.innerHTML = project.title
        repo.href = project.repoURL
        repo.innerHTML = 'Repo';
        
        [title, repo].forEach(el => titleRow.appendChild(el))
        
        const description = createElement('p', '')
        description.innerHTML = project.description;

        [titleRow, description].forEach(el => textCol.appendChild(el));
        
        const tagsContainer = createElement('div', 'project-detail-row project-detail-row--tags')
        tags.forEach(tag => tagsContainer.appendChild(tag));
        
        [textCol, tagsContainer].forEach(el => projectInfoCol.appendChild(el));
        [this.imageContainerEl, projectInfoCol].forEach(el => projectEl.appendChild(el));

        console.log('appending', projectEl)
        this.appendChild(projectEl)
    }


    fetchFullResImage() {
        const imgName: string = this._project.highResImage
        const imgEl = new Image()

        imgEl.onload = () => {
            setTimeout(() => {
                imgEl.classList.add('shown')
                this.lowResImageEl.classList.add('hidden')
    
                setTimeout(() => this.lowResImageEl.remove(), 300)
            }, 10)
        }

        imgEl.src = `images/${imgName}`
        imgEl.className = 'highres'
        this.imageContainerEl.appendChild(imgEl)
    }


    show() {
        this.classList.remove('hidden')
    }

    hide() {
        if (!this.classList.contains('hidden')) {
            this.classList.add('hidden')
        }
    }

    matchesQuery(query: string): boolean {
        const matchesTitle = this._project.title.toLowerCase().includes(query.toLowerCase())
        const matchesDescription = this._project.description.toLowerCase().includes(query.toLowerCase())

        return matchesTitle || matchesDescription
    }
}


customElements.define('project-card', ProjectCard)