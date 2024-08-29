if (location.search.length > 1) {
    const query = location.search.substring(1).split('&')
    const query_values = {}
    query.forEach(q => {
        const operator = q.indexOf('=')
        query_values[q.substring(0, operator)] = q.substring(operator+1)
    })
    console.debug(query_values)
    if (Object.keys(query_values).length > 0) {
        const text = query_values['_text'] ?? false        
        if (text && text.length > 0) {
            encoder(text)
        }
    } 
} 

function encoder(text) {
    const cypher = (callback, s=';', o=':', trim=false, file='../../res/alura.txt') => {
        fetch(file, { mode: 'no-cors' })
            .then(response => response.text())
            .then(data => {console.log(data); callback(data,s,o,trim)})
            .catch(error => console.error(error))
    } 
    cypher((data,separator,operator,trim)=>{
        data= data.split(separator);
        const data_parser = {}
        query.forEach(q => {
            const delimiter = q.indexOf(operator)
            data_parser[q.substring(0, delimiter)] = q.substring(delimiter+1)
        });
        print([...text].map(ch=>{
            data_parser[ch] ?? ch
        }))
    })
}

function print(text, selector='#result-area'){ 
    const p = document.createElement(p)
    p.innerText=text
    document.querySelector(selector).appendChild(p)
}

function print(text_split, selector='#result-area'){ 
    print(text_split.join())
}