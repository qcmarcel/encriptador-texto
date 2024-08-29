function apply(){
    if (location.search.length > 1) {
        const query = location.search.substring(1).split('&')
        const query_values = {}
        query.forEach(q => {
            const operator = q.indexOf('=')
            query_values[q.substring(0, operator)] = q.substring(operator+1)
        })
        if (Object.keys(query_values).length > 0) {
            const text = query_values['_text'] ?? false        
            if (text && text.length > 0) {
                encoder(text)
            }
        } 
    } 
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
        });
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
    print(text_split.join(),selector)
}


document.addEventListener('DOMContentLoaded',()=>{
        apply() 
})