const req = new XMLHttpRequest();
const params = new URLSearchParams(location.search);

if (params.has('drug')) {
    req.open('GET', 'https://api.fda.gov/drug/ndc.json?search=product_id:"' + params.get('drug') + '"');
    req.onload = function () {
        const data = JSON.parse(this.response).results[0];
        console.log(data);

        document.querySelector('.jumbotron').parentElement.removeChild(document.querySelector('.jumbotron'));
        document.querySelector('.drug-data').innerHTML += `
            <div class="container mt-4">
                <div class="row">
                    <div class="col-sm-3">
                        <img src="/assets/img/icons/E307.png" class="lg line img-rounded">
                    </div>
                    <div class="col-sm-9 post">
                        <h1 class="drugs">${data.brand_name.toLowerCase()}</h1>
                        <h2 class="h3">Generic name</h2>
                        <p class="drugs">${data.generic_name.toLowerCase()}</p>
                        <h2 class="h3">Manufacturer</h2>
                        <p class="drugs">${data.openfda.manufacturer_name[0].toLowerCase()}</p>
                        <h2 class="h3">Labeler</h2>
                        <p class="drugs">${data.labeler_name.toLowerCase()}</p>
                        <h2 class="h3">Ingredients</h2>
                        <ul class="ingredients"></ul>
                        <h2 class="h3">Packaging</h2>
                        <p class="drugs">${data.packaging[0].description.toLowerCase()}</p>
                        <h2 class="h3">Type</h2>
                        <p class="drugs">${data.product_type.toLowerCase()}</p>
                        <h2 class="h3">Route</h2>
                        <p class="drugs">${data.route.toString().toLowerCase()}</p>
                        <p class="source mt-5">Data source: <a href="https://open.fda.gov/apis/drug/ndc/">U.S. Food and Drug Administration</a></p>
                    </div>
                </div>
            </div>
        `;
        data.active_ingredients.forEach(ingredient => { document.querySelector('.ingredients').innerHTML += '<li class="drugs">' + ingredient.name.toLowerCase() + '</li>' });
    };
    req.send();
} else {
    document.body.removeChild(document.querySelector('.breadcrumb'));
    document.querySelector('form').onsubmit = function () {
        const form = this;

        document.querySelector('.drug-list').innerHTML = '';
        req.open('GET', 'https://api.fda.gov/drug/ndc.json?search=brand_name:"' + form.children[0].children[1].value + '"');
        req.onload = function () {
            const data = JSON.parse(this.response).results;

            if (data.length > 0) {
                document.querySelector('.jumbotron .col-sm-12').innerHTML = '';
                document.querySelector('.jumbotron').style.marginBottom = '0px';
                document.querySelector('.jumbotron').style.paddingBottom = '0px';
                document.querySelector('h1.results-for').innerHTML = 'Results for \'' + form.children[0].children[1].value + '\'';
                const div = document.querySelector('.drugs');
                div.parentElement.removeChild(div);
                document.querySelector('.drug-list').parentElement.appendChild(div);
                data.forEach(drug => {
                    document.querySelector('.drug-list').innerHTML += `
        <div class="drug mb-5">
            <div class="card">
                <div class="card-body">
                    <h2 class="h4 mb-2">
                        <a href="?drug=${drug.product_id}" class="stretched-link drug-name">
                            <img src="/assets/img/icons/E307.png" class="sm float-left mr-3 line img-thumbnail">
                                ${drug.brand_name.toLowerCase()}
                                (${drug.generic_name.toLowerCase()})</a>
                    </h2>
                    <p>${drug.labeler_name}</p>
                </div>
            </div>
                </div > `;
                });
                document.querySelector('.drug-list').innerHTML += '<h2 class="mb-3">Search drugs</h2>';
                form.children[0].children[1].value = '';
            }
        };
        req.send();
        return false;
    };
}