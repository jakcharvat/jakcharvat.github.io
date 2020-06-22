import './project-card.js'
import ProjectCard from './project-card.js'

let hasAnimationInFinished = false
let hasLoadedProjects = false

const images = []

async function getProjects() {
    const projectsFile = await fetch('../projects/projects.json')
    const projects = await projectsFile.json()

    const containerElement = document.getElementById('projectsGrid')

    document.getElementById('placeholder').remove()

    for (const project of projects) {
        let el = document.createElement('project-card') as ProjectCard
        el.project = project
        containerElement.appendChild(el)
    }

    hasLoadedProjects = true
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
        } else {
            if (!container.classList.contains('has-input')) {
                container.classList.add('has-input')
            }
        }
    }
}

export { getProjects, projectsAnimationInDone, prepareForProjectLoad, initNameTF }