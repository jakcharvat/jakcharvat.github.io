var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import './filter-row.js';
import Project from './project.js';
import ProjectCard from './project-card.js';
let hasAnimationInFinished = false;
let hasLoadedProjects = false;
function getProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(res => setTimeout(res, 5000));
        const projectsFile = yield fetch('../projects/projects.json');
        const projects = (yield projectsFile.json()).map(dict => new Project(dict));
        const containerElement = document.getElementById('projectsGrid');
        document.getElementById('placeholder').remove();
        for (const project of projects) {
            let el = new ProjectCard();
            el.project = project;
            containerElement.appendChild(el);
        }
        hasLoadedProjects = true;
        const filterRow = document.querySelector('filter-row');
        filterRow.initRow(projects);
        fetchFullresImages();
    });
}
function projectsAnimationInDone() {
    hasAnimationInFinished = true;
    fetchFullresImages();
}
function fetchFullresImages() {
    if (!(hasAnimationInFinished && hasLoadedProjects))
        return;
    const projectsContainer = document.getElementById('projectsGrid');
    const projectCards = Array.from(projectsContainer.children);
    projectCards.forEach(card => card.fetchFullResImage());
}
function prepareForProjectLoad() {
    hasLoadedProjects = false;
    hasAnimationInFinished = false;
}
export { getProjects, projectsAnimationInDone, prepareForProjectLoad };
