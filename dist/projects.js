var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import './webcomponents/filter-row.js';
import Project from './project.js';
import ProjectCard from './webcomponents/project-card.js';
let hasAnimationInFinished = false;
let hasLoadedProjects = false;
let filterRow;
let requestedFilter;
function getProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        requestedFilter = getURLParameters()['filter'];
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
        filterRow = document.querySelector('filter-row');
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
function transitionStartHandler() {
    filterRow.removeIfStuck();
}
function isOnProjectsPage() {
    const pathName = window.location.pathname;
    return pathName === '/projects/' || pathName === '/projects/index.html';
}
function getURLParameters() {
    let paramsString = window.location.search;
    if (paramsString === '') {
        return {};
    }
    paramsString = paramsString.replace('?', '');
    const paramsArr = paramsString.split('&');
    let params = {};
    paramsArr.forEach(param => {
        const split = param.split('=');
        params[split[0]] = split[1];
    });
    return params;
}
export { getProjects, projectsAnimationInDone, prepareForProjectLoad, transitionStartHandler, isOnProjectsPage, requestedFilter, };
