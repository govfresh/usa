function include(file_name, parent_selector) {
    const req = new XMLHttpRequest();
    req.open('GET', '/includes/' + file_name, true);
    req.onload = function () {
        if (this.status > 399)
            throw new Error('Could not load file /includes/' + file_name);
        else {
            const insert = document.createElement('div');
            insert.innerHTML = this.response;
            document.querySelector(parent_selector).appendChild(insert);
        }
    };
    req.send();
}