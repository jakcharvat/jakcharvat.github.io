var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import './project-card.js';
let hasAnimationInFinished = false;
let hasLoadedProjects = false;
const images = [];
function getProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectsFile = yield fetch('../projects/projects.json');
        const projects = yield projectsFile.json();
        const containerElement = document.getElementById('projectsGrid');
        document.getElementById('placeholder').remove();
        for (const project of projects) {
            let el = document.createElement('project-card');
            el.project = project;
            containerElement.appendChild(el);
        }
        hasLoadedProjects = true;
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
        }
        else {
            if (!container.classList.contains('has-input')) {
                container.classList.add('has-input');
            }
        }
    };
}
export { getProjects, projectsAnimationInDone, prepareForProjectLoad, initNameTF };
