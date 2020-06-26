import Project, { ProjectDict } from './project.js'
import ProjectCard from './project-card.js'
import TagsWindow from './tags-window.js'

let hasAnimationInFinished = false
let hasLoadedProjects = false

async function getProjects() {
    const projectsFile = await fetch('../projects/projects.json')
    const projects = (await projectsFile.json() as ProjectDict[]).map(dict => new Project(dict))

    const containerElement = document.getElementById('projectsGrid')

    document.getElementById('placeholder').remove()

    for (const project of projects) {
        let el = new ProjectCard()
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
        projects.forEach(project => project.matchesQuery = true)
        return
    }

    projects.forEach(card => card.matchesQuery = card._project.matchesQuery(query))
}

function filter(tags: string[]) {
    let projects = Array.from(document.getElementById('projectsGrid').children) as ProjectCard[]

    if (tags.length === 0) {
        projects.forEach(project => project.matchesTag = true)
        return
    }

    projects.forEach(card => card.matchesTag = card._project.matchesTags(tags))
}


function getTags(projects: Project[]) {
    const tagsRaw = (projects ?? []).reduce((acc, curr) => [...acc, ...(curr.tags ?? [])], [])
    const tags = Array.from(new Set(tagsRaw)) as string[]
    const sortedTags = tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    createTagsWindow(sortedTags)
}

function createTagsWindow(tags: string[]) {
    const tagsWindow = new TagsWindow()
    tagsWindow.tags = tags
    tagsWindow.onfilter = filter
    tagsWindow.setupListeners()
    
    document.body.appendChild(tagsWindow)
    tagsWindow.getHeight()
}

export { getProjects, projectsAnimationInDone, prepareForProjectLoad, initNameTF }