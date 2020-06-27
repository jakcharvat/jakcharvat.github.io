import { swup } from './main.js';
function initAboutPage() {
    const about = document.getElementById('about');
    const links = Array.from(about.getElementsByClassName('linkable'));
    links.forEach(link => {
        const text = link.innerHTML;
        link.className = 'link';
        link.onclick = e => {
            swup.loadPage({ url: `/projects/index.html?filter=${text}` });
        };
    });
}
export { initAboutPage };
