import { 
    getProjects, 
    projectsAnimationInDone, 
    prepareForProjectLoad,
    initNameTF
} from './projects.js'

// @ts-ignore
const swup = new Swup()

swup.on('animationInDone', animationInDone)
swup.on('contentReplaced', activateLink)
window.onload = () => {
    activateLink()
    animationInDone()
}

const links = Array.from(document.getElementById('nav').children).filter((el: HTMLElement) => {
    return el.tagName == 'A'
}) as HTMLAnchorElement[]


/**
Mobile hamburger menu

links.forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('cross').checked = false
    })
})
*/

function activateLink() {
    const address = window.location.pathname
    
    for (let link of links) {
        const linkAddr = link.pathname
        
        if (linkAddr === address) {
            if (!link.classList.contains('active')) {
                link.classList.add('active')
            }
        } else {
            link.classList.remove('active')
        }
    }

    if (address === '/') {
        document.body.className = 'root-page'
    } else {
        document.body.className = ''
    }


    if (address === '/projects/') {
        prepareForProjectLoad()
        getProjects()
        initNameTF()
    }
}


function animationInDone() {
    if (window.location.pathname === '/projects/') {
        projectsAnimationInDone()
    }
}