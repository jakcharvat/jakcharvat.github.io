var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const images = [];
function getProjects() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const projectsFile = yield fetch('../projects/projects.json');
        const projects = yield projectsFile.json();
        const containerElement = document.getElementById('projectsGrid');
        const templateEl = document.getElementById('project-template');
        const projectTemplateEl = templateEl.content.children[0];
        for (const project of projects) {
            const projectEl = projectTemplateEl.cloneNode(true);
            const tags = (_a = project['tags'], (_a !== null && _a !== void 0 ? _a : [])).map(tag => {
                return `<div class="project-tag">${tag}</div>`;
            }).join('\n');
            let projectInnerEl = projectEl.innerHTML;
            projectInnerEl = projectInnerEl
                .replace('{{Title}}', project['title'])
                .replace('{{LowresURL}}', `images/${project['lowResImage']}`)
                .replace('{{RepoURL}}', project['repoURL'])
                .replace('{{Description}}', project['description'])
                .replace('{{Tags}}', tags)
                .replace('{{URL}}', project['url']);
            projectEl.innerHTML = projectInnerEl;
            containerElement.appendChild(projectEl);
            images.push({
                url: project['highResImage'],
                imageContainerEl: Array.from(projectEl.children).filter(el => el.className == 'project-image')[0]
            });
        }
        fetchFullresImages();
    });
}
function fetchFullresImages() {
    images.forEach(img => {
        const imgName = img['url'];
        const container = img['imageContainerEl'];
        const imgEl = new Image();
        imgEl.src = `images/${imgName}`;
        imgEl.className = 'highres';
        container.appendChild(imgEl);
        const lowresImgEl = Array.from(container.children)[0];
        setTimeout(() => {
            imgEl.classList.add('shown');
            lowresImgEl.classList.add('hidden');
            setTimeout(() => lowresImgEl.remove(), 300);
        }, 10);
    });
}
export { getProjects };
