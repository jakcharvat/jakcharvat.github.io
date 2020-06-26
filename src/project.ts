type ProjectDict = {
    title: string,
    description: string,
    url: string,
    repoURL: string,
    lowResImage: string,
    highResImage: string,
    tags: string[],
}


class Project {
    title: string
    description: string
    url: string
    repoURL: string
    lowResImage: string
    highResImage: string
    tags: string[]

    constructor(dict: ProjectDict) {
        this.title = dict.title ?? "Missing Title"
        this.description = dict.description ?? "Missing Description"
        this.url = dict.url ?? "Missing URL"
        this.repoURL = dict.repoURL ?? "Missing Repo URL"
        this.lowResImage = dict.lowResImage ?? ""
        this.highResImage = dict.highResImage ?? ""
        this.tags = dict.tags ?? []
    }

    matchesQuery(query: string): boolean {
        const matchesTitle = this.title.toLowerCase().includes(query.toLowerCase())
        const matchesDescription = this.description.toLowerCase().includes(query.toLowerCase())

        return matchesTitle || matchesDescription
    }

    matchesTags(tags: string[]): boolean {
        for (const tag of tags) {
            if (!this.tags.includes(tag)) {
                return false
            }
        }

        return true
    }
}


export default Project
export { ProjectDict }