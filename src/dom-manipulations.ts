function createElement(element: string, className: string): HTMLElement {
    const el = document.createElement(element)
    el.className = className
    return el
}

export { createElement }