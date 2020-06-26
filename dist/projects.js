var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Project from './project.js';
import ProjectCard from './project-card.js';
import TagsWindow from './tags-window.js';
let hasAnimationInFinished = false;
let hasLoadedProjects = false;
function getProjects() {
    return __awaiter(this, void 0, void 0, function* () {
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
        getTags(projects);
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
function initNameTF() {
    const container = document.getElementById('nameTFContainer');
    const tf = document.getElementById('nameTF');
    let placeholderText = tf.getAttribute('placeholder');
    if (placeholderText) {
        container.setAttribute('data-label', placeholderText);
        tf.classList.add('label-hidden');
    }
    tf.oninput = e => {
        if (tf.value.trim() === '') {
            tf.value = tf.value.trim();
            container.classList.remove('has-input');
            search();
        }
        else {
            if (!container.classList.contains('has-input')) {
                container.classList.add('has-input');
            }
            search(tf.value);
        }
    };
}
function search(query) {
    let projects = Array.from(document.getElementById('projectsGrid').children);
    if (query === undefined || query === null) {
        projects.forEach(project => project.matchesQuery = true);
        return;
    }
    projects.forEach(card => card.matchesQuery = card._project.matchesQuery(query));
}
function filter(tags) {
    let projects = Array.from(document.getElementById('projectsGrid').children);
    if (tags.length === 0) {
        projects.forEach(project => project.matchesTag = true);
        return;
    }
    projects.forEach(card => card.matchesTag = card._project.matchesTags(tags));
}
function getTags(projects) {
    const tagsRaw = ((projects !== null && projects !== void 0 ? projects : [])).reduce((acc, curr) => { var _a; return [...acc, ...(_a = curr.tags, (_a !== null && _a !== void 0 ? _a : []))]; }, []);
    const tags = Array.from(new Set(tagsRaw));
    const sortedTags = tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    createTagsWindow(sortedTags);
}
function createTagsWindow(tags) {
    const tagsWindow = new TagsWindow();
    tagsWindow.tags = tags;
    tagsWindow.onfilter = filter;
    tagsWindow.setupListeners();
    document.body.appendChild(tagsWindow);
    tagsWindow.getHeight();
}
export { getProjects, projectsAnimationInDone, prepareForProjectLoad, initNameTF };
