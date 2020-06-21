let hasAnimationInFinished = false
let hasLoadedProjects = false

const images = []

async function getProjects() {
    const projectsFile = await fetch('../projects/projects.json')
    const projects = await projectsFile.json()

    const containerElement = document.getElementById('projectsGrid')

    const templateEl = document.getElementById('project-template') as HTMLTemplateElement
    const projectTemplateEl = templateEl.content.children[0]

    for (const project of projects) {
        const projectEl = projectTemplateEl.cloneNode(true) as HTMLElement

        const tags = (project['tags'] ?? []).map(tag => {
            return `<div class="project-tag">${tag}</div>`
        }).join('\n')

        let projectInnerEl = projectEl.innerHTML
        projectInnerEl = projectInnerEl
            .replace('{{Title}}', project['title'])
            .replace('{{LowresURL}}', `images/${project['lowResImage']}`)
            .replace('{{RepoURL}}', project['repoURL'])
            .replace('{{Description}}', project['description'])
            .replace('{{Tags}}', tags)
            .replace('{{URL}}', project['url'])

        projectEl.innerHTML = projectInnerEl
        containerElement.appendChild(projectEl)

        images.push({
            url: project['highResImage'],
            imageContainerEl: Array.from(projectEl.children).filter(el => el.className == 'project-image')[0]
        })
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

    images.forEach(img => {
        const imgName: string = img['url']
        const container: HTMLElement = img['imageContainerEl']

        const imgEl = new Image()
        imgEl.src = `images/${imgName}`
        imgEl.className = 'highres'
        container.appendChild(imgEl)

        const lowresImgEl = Array.from(container.children)[0]

        imgEl.onload = () => {
            setTimeout(() => {
                imgEl.classList.add('shown')
                lowresImgEl.classList.add('hidden')
    
                setTimeout(() => lowresImgEl.remove(), 300)
            }, 10)
        }
    })
}


function prepareForProjectLoad() {
    hasLoadedProjects = false
    hasAnimationInFinished = false
}

export { getProjects, projectsAnimationInDone, prepareForProjectLoad }