async function getProjects() {
    const projectsFile = await fetch('../projects/projects.json')
    const projects = await projectsFile.json()

    for (const project of projects) {
        console.log(project)
    }
}


export { getProjects }