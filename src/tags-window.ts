import { createElement } from "./dom-manipulations.js"
import Project from './project.js';

class TagsWindow extends HTMLElement {
    _projects: Project[]
    _tags: string[]
    _title: HTMLHeadingElement
    _filteredTags: Set<string> = new Set<string>()
    _onfilter: Function

    set projects(projects: Project[]) {
        this._projects = projects
    }

    set tags(tags: string[]) {
        this._tags = tags

        const tagEls = tags.map(tag => {
            let el = new TagElement()
            el.label = tag
            el.onfilter = (label: string, isOn: boolean) => this.tagChanged(label, isOn)
            return el
        })

        const overlay = createElement('div', 'overlay')
        const window = createElement('div', 'window')

        const title = document.createElement('h2')
        title.innerHTML = 'Showing all projects'

        window.appendChild(title)
        tagEls.forEach(tag => window.appendChild(tag))

        this.appendChild(overlay)
        this.appendChild(window)

        this._title = title
    }

    setupListeners() {
        const button = document.getElementById('filterTagsButton')
        const overlay = Array.from(this.children).filter(el => el.classList.contains('overlay'))[0] as HTMLDivElement
        const window = Array.from(this.children).filter(el => el.classList.contains('window'))[0] as HTMLElement

        button.onclick = e => {
            const buttonRect = button.getBoundingClientRect()
            const windowStyle = globalThis.window.getComputedStyle(window)

            const windowWidth = parseFloat(windowStyle.width)
            const windowHeight = parseFloat(windowStyle.height)

            let x = buttonRect.x
            let y = buttonRect.y

            const endWindowRight = x + windowWidth
            const endWindowBottom = y + windowHeight
            const maxWindowRight = globalThis.window.innerWidth - 20
            const maxWindowBottom = globalThis.window.innerHeight - 20

            if (endWindowRight > maxWindowRight) {
                const overflow = endWindowRight - maxWindowRight
                x -= overflow
            }

            if (endWindowBottom > maxWindowBottom) {
                const overflow = endWindowBottom - maxWindowBottom
                y -= overflow
            }

            window.style.left = `${x}px`
            window.style.top = `${y}px`

            this.classList.add('display-shown')
            setTimeout(() => {
                this.classList.add('shown') 
            }, 10);
        }

        overlay.onclick = e => {
            this.classList.remove('shown')
            setTimeout(() => {
                this.classList.remove('display-shown')
            }, 300)
        }
    }

    tagChanged(label: string, isOn: boolean) {
        console.log(this)

        if (isOn) {
            this._filteredTags.add(label)
        } else {
            this._filteredTags.delete(label)
        }

        if (this._filteredTags.size === 0) {
            this._title.innerHTML = 'Showing all projects'
        } else {
            const tagCount = this._filteredTags.size
            this._title.innerHTML = `Filtering ${tagCount} ${tagCount === 1 ? 'tag' : 'tags'}`
        }

        this._onfilter(Array.from(this._filteredTags))
    }

    set onfilter(callback: Function) {
        this._onfilter = callback
    }
}


class TagElement extends HTMLElement {
    _label: string
    _isOn: boolean
    _checkbox: HTMLInputElement
    _onfilter: Function

    constructor() {
        super()
        this._label = ''
        this._isOn = false
    }

    set label(label: string) {
        this._label = label

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.name = `${label}Checkbox`
        checkbox.id = checkbox.name
        checkbox.className = 'filter-checkbox'

        const labelEl = document.createElement('label')
        labelEl.htmlFor = `${label}Checkbox`
        labelEl.innerHTML = label

        this.appendChild(checkbox)
        this.appendChild(labelEl)

        this._checkbox = checkbox

        this.setupListeners()
    }

    set onfilter(callback: Function) {
        this._onfilter = callback
    }

    setupListeners() {
        this.onclick = e => {
            e.preventDefault()
            e.stopPropagation()
            
            this._isOn = !this._isOn
            this._checkbox.checked = this._isOn
            this._onfilter(this._label, this._isOn)
        }
    }
}

customElements.define('tags-window', TagsWindow)
customElements.define('tag-element', TagElement)

export default TagsWindow