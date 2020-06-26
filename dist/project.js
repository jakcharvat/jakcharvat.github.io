class Project {
    constructor(dict) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.title = (_a = dict.title, (_a !== null && _a !== void 0 ? _a : "Missing Title"));
        this.description = (_b = dict.description, (_b !== null && _b !== void 0 ? _b : "Missing Description"));
        this.url = (_c = dict.url, (_c !== null && _c !== void 0 ? _c : "Missing URL"));
        this.repoURL = (_d = dict.repoURL, (_d !== null && _d !== void 0 ? _d : "Missing Repo URL"));
        this.lowResImage = (_e = dict.lowResImage, (_e !== null && _e !== void 0 ? _e : ""));
        this.highResImage = (_f = dict.highResImage, (_f !== null && _f !== void 0 ? _f : ""));
        this.tags = (_g = dict.tags, (_g !== null && _g !== void 0 ? _g : []));
    }
    matchesQuery(query) {
        const matchesTitle = this.title.toLowerCase().includes(query.toLowerCase());
        const matchesDescription = this.description.toLowerCase().includes(query.toLowerCase());
        return matchesTitle || matchesDescription;
    }
    matchesTags(tags) {
        for (const tag of tags) {
            if (!this.tags.includes(tag)) {
                return false;
            }
        }
        return true;
    }
}
export default Project;
