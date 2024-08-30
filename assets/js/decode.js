function set(){
    document.querySelectorAll('button,a').forEach(e => {
        if (e.innerText.toLowerCase().indexOf('decode') > -1){
            console.debug('decode?:', e)
            e.addEventListener('click' , (e)=> {
                e.preventDefault()
                dispatch()
            })
        }
    })
}

function dispatch(selector='#text'){
    let text = document.querySelector(selector)?.value ?? false
    if (location.search.length > 1) {
        const query = location.search.substring(1).split('&')
        const query_values = {}
        query.forEach(q => {
            const operator = q.indexOf('=')
            query_values[q.substring(0, operator)] = decodeURI(q.substring(operator+1))
        })
        if (Object.keys(query_values).length > 0) {
            text = query_values['_text'] ?? false
        } 
    } 
    if (text && text.length > 0) {
        decoder(text)
    }
}

function decoder(text) {
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
            data_parser[v.substring(delimiter+1)] = v.substring(0, delimiter)
        })
        Object.entries(data_parser).forEach(([k,v])=>text = text.replaceAll(k,v))
        print(text)
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
    console.debug('... decode ...')
    set() 
    dispatch()
})