const swup = new Swup()

swup.on('contentReplaced', activateLink)
document.onload = activateLink

const links = Array.from(document.getElementById('nav').children).filter(el => {
    return el.tagName == 'A'
})


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
}