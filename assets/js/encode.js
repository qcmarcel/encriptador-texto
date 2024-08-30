function set(){
    document.querySelectorAll('button,a').forEach(e => {
        if (e.innerText.toLowerCase().indexOf('encode') > -1){
            console.debug('encode?:', e)
            e.addEventListener('click' , (e)=> {
                e.preventDefault()
                const input = document.querySelector(apply(false))
                clear(input)   
            })
        }
    })
}

function clear(input) {
    if (input != null) input.value = ""
}

function apply(query=true, selector='#text'){    
    let text = document.querySelector(selector)?.value ?? false
    if (query) {
        text = textQuery(text) 
    } 
    if (text && text.length > 0) {
        encoder(text)
    }
    return selector
}

function textQuery(text) {
    if (location.search.length <= 0){
        return text
    }
    text=false
    const query = location.search.substring(1).split('&')
    const query_values = {}
    query.forEach(q => {
        const operator = q.indexOf('=')
        query_values[q.substring(0, operator)] = decodeURI(q.substring(operator + 1))
    })
    const has_query_values = Object.keys(query_values).length > 0
    const mode = query_values['mode'] ?? false
    if (has_query_values && mode !== 'decode') {
        text = query_values['_text'] ?? false
    }
    return text
}

function encoder(text) {
    const cypher = (callback, trim=false, s=';', o=':', file='./res/alura.txt') => {
        fetch(file, { mode: 'no-cors' })
            .then(response => response.text())
            .then(data => {console.debug(data); callback(data,trim,s,o)})
            .catch(error => console.error(error))
    } 
    cypher((data,trim,separator,operator)=>{
        data = data.replace('\r\n','')
        if (trim) {data = data.replaceAll(' ','')}
        data = data.split(separator)
        const data_parser = {}
        data.forEach(v => {
            const delimiter = v.indexOf(operator)
            data_parser[v.substring(0, delimiter)] = v.substring(delimiter+1)
        })
        print_arr([...text].map(ch=> data_parser[ch] ?? ch ))
    },true)
}

function print(text, selector='#result-area'){ 
    const p = document.createElement('p')
    p.innerText=text
    if (document.querySelector(selector) != null)
        document.querySelector(selector).appendChild(p)

    else
        console.debug(p)
}

function print_arr(text_split, selector='#result-area'){ 
    print(text_split.join(''),selector)
}


document.addEventListener('DOMContentLoaded',()=>{
    console.debug('... encode ...')
    set()
    apply() 
})