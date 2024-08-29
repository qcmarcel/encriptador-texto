if (location.search.length > 1) {
    const query = location.search.substring(1).split('&')
    const query_values = {}
    query.forEach(q => query_values[q.substring(0, q.indexOf('='))] = q.substring(q.indexOf('=')))
    console.debug(query_values)
} 