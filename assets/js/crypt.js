const ENC = 'encode'
const DEC = 'decode'
const ACTION_SELECTORS = 'button,a'
const PRINT_SELECTOR = '#result-area'
const TEXT_SELECTOR = '#text'

function initialize() {
    document.querySelectorAll(ACTION_SELECTORS).forEach(e => {
        const action = e.innerText.toLowerCase().indexOf(DEC) > -1 ? DEC : ENC
        if ([ENC,DEC].includes(action)) {
            e.addEventListener('click', (event) => {
                event.preventDefault()
                const input = document.querySelector(process(false, action))
                clear(input)
            })
        }
    })
}

function clear(input) {
    if (input != null) input.value = ""
}

function process(query = true, action, selector = TEXT_SELECTOR) {
    let text = document.querySelector(selector)?.value ?? false
    if (query) [text, action] = getTextQuery(text, action)
    if (text && text.length > 0) {
        ([encoder,decoder])[Number(action === DEC)](text)
    }
    return selector
}

function getTextQuery(text, action) {
    if (location.search.length <= 0) return text
    const query_values = Object.fromEntries(new URLSearchParams(location.search))
    const mode = query_values['mode'] ?? ENC
    if (Object.keys(query_values).length > 0) {
        text = query_values['_text'] ?? false
    }
    return [text, mode]
}

function cypher(callback, trim = false, s = ';', o = ':', file = './res/alura.txt') {
    fetch(file, { mode: 'no-cors' })
        .then(response => response.text())
        .then(data => callback(data, trim, s, o))
        .catch(error => console.error(error))
}

function decoder(text) {
    cypher((data, trim, separator, operator) => {
        const data_parser = parseData(data, trim, separator, operator)
        Object.entries(data_parser).forEach(([k, v]) => text = text.replaceAll(k, v))
        print(text)
    }, true)
}

function encoder(text) {
    cypher((data, trim, separator, operator) => {
        const data_parser = parseData(data, trim, separator, operator, true)
        print_arr([...text].map(ch => data_parser[ch] ?? ch))
    }, true)
}

function parseData(data, trim, separator, operator, reverse = false) {
    data = data.replace('\r\n', '')
    if (trim) data = data.replaceAll(' ', '')
    return Object.fromEntries(data.split(separator).map(v => {
        const delimiter = v.indexOf(operator)
        let entry = [v.substring(0, delimiter), v.substring(delimiter + 1)] 
        if (!reverse) entry = entry.reverse()
        return entry
    }))
}

function print(text, selector = PRINT_SELECTOR) {
    const p = document.createElement('p')
    p.innerText = text
    document.querySelector(selector)?.appendChild(p) ?? console.debug(p)
}

function print_arr(text_split, selector = PRINT_SELECTOR) {
    print(text_split.join(''), selector)
}

document.addEventListener('DOMContentLoaded', () => {
    console.debug('... initializing ...')
    initialize()
    process()
})
