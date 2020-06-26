const filterTFStyle = `
#nameTFContainer {
    position: relative;
    height: 28px;
}
#nameTFContainer input {
    width: 100%;
    height: 100%;
    background: transparent;
    padding: 0px 4px;
    border: none;
    outline: none;
    color: var(--alternate-opposite-color);
    font-family: futura-pt, "Futura", sans-serif;
    font-size: 1.1rem;
    text-align: justify;
    line-height: 1.6;
}
#nameTFContainer input.label-hidden::placeholder {
    opacity: 0;
}
#nameTFContainer[data-label]::before {
    content: attr(data-label);
    position: absolute;
    color: var(--alternate-opposite-color);
    font-family: futura-pt, "Futura", sans-serif;
    font-size: 1.1rem;
    text-align: justify;
    line-height: 1.6;
    padding: 0 4px;
    color: rgba(var(--opposite-color-rgb), 0.8);
    pointer-events: none;
    transform: scale(1) translate(0);
    transform-origin: left top;
    transition: all 0.2s ease;
}
#nameTFContainer.has-input::before, #nameTFContainer:focus-within::before {
    transform: scale(0.75) translateY(-30px);
}
#nameTFContainer:focus-within::before {
    color: var(--primary-color);
}
#nameTFContainer::after {
    content: "";
    bottom: 0;
    width: 100%;
    height: 4px;
    opacity: 0.8;
    left: 0;
    position: absolute;
    z-index: -1;
    background: var(--primary-color);
    transition: height 0.2s ease, opacity 0.2s ease;
}
#nameTFContainer:focus-within::after, #nameTFContainer:hover::after {
    height: 60%;
    opacity: 0.2;
}
`

export default filterTFStyle