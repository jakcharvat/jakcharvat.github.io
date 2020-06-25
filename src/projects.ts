import './project-card.js'
import ProjectCard from './project-card.js'

let hasAnimationInFinished = false
let hasLoadedProjects = false

async function getProjects() {
    const projectsFile = await fetch('../projects/projects.json')
    const projects = await projectsFile.json() as Project[]

    const containerElement = document.getElementById('projectsGrid')

    document.getElementById('placeholder').remove()

    for (const project of projects) {
        let el = document.createElement('project-card') as ProjectCard
        el.project = project
        containerElement.appendChild(el)
    }

    hasLoadedProjects = true
    getTags(projects)
    fetchFullresImages()
}


function projectsAnimationInDone() {
    hasAnimationInFinished = true
    fetchFullresImages()
}

function fetchFullresImages() {
    if (!(hasAnimationInFinished && hasLoadedProjects)) return;

    const projectsContainer = document.getElementById('projectsGrid')
    const projectCards = Array.from(projectsContainer.children) as ProjectCard[]

    projectCards.forEach(card => card.fetchFullResImage())
}


function prepareForProjectLoad() {
    hasLoadedProjects = false
    hasAnimationInFinished = false
}

function initNameTF() {
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
            search()
        } else {
            if (!container.classList.contains('has-input')) {
                container.classList.add('has-input')
            }

            search(tf.value)
        }
    }
}

function search(query?: string) {
    let projects = Array.from(document.getElementById('projectsGrid').children) as ProjectCard[]
    
    if (query === undefined || query === null) {
        projects.forEach(project => project.show())
        return
    }

    projects.forEach(project => {
        if (project.matchesQuery(query)) {
            project.show()
        } else if (!project.classList.contains('hidden')) {
            project.hide()
        }
    })
}


function getTags(projects: Project[]) {
    const tagsRaw = projects.reduce((acc, curr) => [...acc, ...curr.tags], [])
    const tags = Array.from(new Set(tagsRaw)) as String[]
    const sortedTags = tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    createTagsWindow(sortedTags)
}

function createTagsWindow(tags: String[]) {
    const tagsWindow = document.querySelector('tags-window')
    const button = document.getElementById('filterTagsButton')
    const overlay = Array.from(tagsWindow.children).filter(el => el.classList.contains('overlay'))[0] as HTMLDivElement
    const window = Array.from(tagsWindow.children).filter(el => el.classList.contains('window'))[0] as HTMLElement

    button.onclick = e => {
        const pos = (e.target as HTMLElement).getBoundingClientRect()
        const x = pos.x - 10
        const y = pos.y + pos.height - 10

        window.style.left = `${x}px`
        window.style.top = `${y}px`

        tagsWindow.classList.add('display-block')
        setTimeout(() => {
            tagsWindow.classList.add('shown') 
        }, 10);
    }

    overlay.onclick = e => {
        tagsWindow.classList.remove('shown')
        setTimeout(() => {
            tagsWindow.classList.remove('display-block')
        }, 300)
    }
}

export { getProjects, projectsAnimationInDone, prepareForProjectLoad, initNameTF }