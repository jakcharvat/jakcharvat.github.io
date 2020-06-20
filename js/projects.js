async function getProjects() {
    const projectsFile = await fetch('../projects/projects.json')
    const projects = await projectsFile.json()

    const containerElement = document.getElementById('projectsGrid')

    const templateEl = document.getElementById('project-template')
    const projectTemplateEl = templateEl.content.children[0]
    console.log(projectTemplateEl)

    for (const project of projects) {
        const projectEl = projectTemplateEl.cloneNode(true)

        const tagContainer = document.createElement('div')
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

        console.log(projectInnerEl)

        projectEl.innerHTML = projectInnerEl
        containerElement.appendChild(projectEl)
    }
}


export { getProjects }