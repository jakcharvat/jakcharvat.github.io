import ProjectCard from "./project-card.js"
import Project from "../project.js"
import TagsWindow from "./tags-window.js"
import  "./filter-textfield.js"
import FilterTextfield from "./filter-textfield.js"

class FilterRow extends HTMLElement {
    _parent: HTMLElement
    _initialOffsetTop: number
    _initialParentOffsetTop: number

    constructor() {
        super()

        Array.from(this.children).forEach(el => el.remove())

        const tf = new FilterTextfield((str?: string) => this.search(str))
        const button = document.createElement('button')
        button.id = 'filterTagsButton'
        button.innerHTML = 'Filter tags'

        this.appendChild(tf)
        this.appendChild(button)

        window.addEventListener('resize', () => {
            this.onScroll()
        })
    }

    initRow(projects: Project[]) {
        this.getTags(projects)
        this.classList.add('shown')
        
        // this.classList.add('stuck')
        this.initScrollListener()
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

    initScrollListener() {
        this._initialOffsetTop = this.offsetTop
        this._initialParentOffsetTop = (this._parent ?? this.parentElement).offsetTop

        window.onscroll = () => this.onScroll()
    }

    onScroll() {
        const parentOffsetTop = (this._parent ?? this.parentElement).offsetTop
        const diff = this._initialParentOffsetTop - parentOffsetTop
        const offset = (this._initialOffsetTop - diff) + parentOffsetTop

        if (window.scrollY > offset - 12) {
            this.updateStuckPosition()

            if (this.classList.contains('stuck')) { return }
            
            const height = this.getBoundingClientRect().height
            const offset = height + parseInt(window.getComputedStyle(this).marginTop)
            document.getElementById('projectsGrid').style.marginTop = `${offset}px`
            this.classList.add('stuck')
            
            this._parent = this.parentElement
            this._parent.removeChild(this)
            document.body.appendChild(this)

            this.updateStuckPosition()
        } else {
            if (!this.classList.contains('stuck')) { return }
            this.classList.remove('stuck')
            const grid = document.getElementById('projectsGrid')
            grid.style.marginTop = '0px'

            this.style.cssText = ''

            document.body.removeChild(this)
            this._parent.insertBefore(this, grid)
        }
    }

    updateStuckPosition() {
        const container = document.querySelector('.content.content--projects')
        const containerStyle = window.getComputedStyle(container)
        this.style.left = containerStyle.left
        this.style.transform = containerStyle.transform
        this.style.width = containerStyle.width
        this.style.maxWidth = containerStyle.maxWidth
    }
}


customElements.define('filter-row', FilterRow)

export default FilterRow
