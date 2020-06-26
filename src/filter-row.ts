class FilterRow extends HTMLElement {
    constructor() {
        super()

        this.innerHTML = `
        <div id="nameTFContainer">
            <input type="text" name="nameTF" id="nameTF", placeholder="Search..." autocomplete="off">
        </div>
        <button id="filterTagsButton">Filter tags</button>
        `
    }
}


customElements.define('filter-row', FilterRow)