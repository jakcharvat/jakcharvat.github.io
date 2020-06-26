import ProjectCard from "./project-card.js"
import Project from "./project.js"
import TagsWindow from "./tags-window.js"

class FilterRow extends HTMLElement {
    constructor() {
        super()

        this.innerHTML = `
        <div id="nameTFContainer">
            <input type="text" name="nameTF" id="nameTF", placeholder="Search..." autocomplete="off">
        </div>
        <button id="filterTagsButton">Filter tags</button>
        `
    }

    initRow(projects: Project[]) {
        this.initNameTF()
        this.getTags(projects)
        this.classList.add('shown')
    }

    initNameTF() {
        const container = document.getElementById('nameTFContainer')
        const tf = document.getElementById('nameTF') as HTMLInputElement
    
        let placeholderText = tf.getAttribute('placeholder')
        if (placeholderText) {
            container.setAttribute('data-label', placeholderText)
            tf.classList.add('label-hidden')
        }
    
        tf.oninput = e => {
            if (tf.value.trim() === '') {
                tf.value = tf.value.trim()
                container.classList.remove('has-input')
                this.search()
            } else {
                if (!container.classList.contains('has-input')) {
                    container.classList.add('has-input')
                }
    
                this.search(tf.value)
            }
        }
    }
    
    search(query?: string) {
        let projects = Array.from(document.getElementById('projectsGrid').children) as ProjectCard[]
        
        if (query === undefined || query === null) {
            projects.forEach(project => project.matchesQuery = true)
            return
        }
    
        projects.forEach(card => card.matchesQuery = card._project.matchesQuery(query))
    }
    
    filter(tags: string[]) {
        let projects = Array.from(document.getElementById('projectsGrid').children) as ProjectCard[]
    
        if (tags.length === 0) {
            projects.forEach(project => project.matchesTag = true)
            return
        }
    
        projects.forEach(card => card.matchesTag = card._project.matchesTags(tags))
    }
    
    
    getTags(projects: Project[]) {
        const tagsRaw = (projects ?? []).reduce((acc, curr) => [...acc, ...(curr.tags ?? [])], [])
        const tags = Array.from(new Set(tagsRaw)) as string[]
        const sortedTags = tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        this.createTagsWindow(sortedTags)
    }
    
    createTagsWindow(tags: string[]) {
        const tagsWindow = new TagsWindow()
        tagsWindow.tags = tags
        tagsWindow.onfilter = (tags: string[]) => this.filter(tags)
        tagsWindow.setupListeners()
        
        document.body.appendChild(tagsWindow)
        tagsWindow.getHeight()
    }
}


customElements.define('filter-row', FilterRow)

export default FilterRow
