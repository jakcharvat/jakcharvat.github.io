import './webcomponents/filter-row.js'
import Project, { ProjectDict } from './project.js'
import ProjectCard from './webcomponents/project-card.js'
import FilterRow from './webcomponents/filter-row.js'

let hasAnimationInFinished = false
let hasLoadedProjects = false

let filterRow: FilterRow

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
    
    filterRow = document.querySelector('filter-row') as FilterRow
    filterRow.initRow(projects)

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

function transitionStartHandler() {
    filterRow.removeIfStuck()
}

export { 
    getProjects,
    projectsAnimationInDone,
    prepareForProjectLoad,
    transitionStartHandler,
}