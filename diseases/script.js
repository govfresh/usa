const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const div = document.querySelector('.data');
const req = new XMLHttpRequest();
req.open('GET', 'https://data.cdc.gov/resource/x9gk-5huc.json?$where=m1 > 1&$limit=6000000&week=' + (Math.floor((now - start) / 1000 / 60 / 60 / 24 / 7) - 2));
req.onload = function () {
    const data = JSON.parse(this.response);

    document.addEventListener('mouseover', function (e) {
        if (e.target.tagName == 'path') {
            div.innerHTML = '<h3>' + e.target.getAttribute('data-name') + '</h3>';
            const diseases = data.filter(item => item.states == e.target.getAttribute('data-name').toUpperCase());
            if (diseases.length == 0)
                div.innerHTML += 'No cases reported';
            else
                diseases.forEach(disease => {
                    div.innerHTML += `${disease.label} (${disease.m1})<br>`;
                });
        }
    });

    document.querySelector('.loading-include').parentElement.removeChild(document.querySelector('.loading-include'));
};
req.send();