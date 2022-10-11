const req = new XMLHttpRequest();
const params = new URLSearchParams(location.search);

if (params.has('drug')) {
    req.open('GET', 'https://api.fda.gov/drug/ndc.json?search=product_id:"' + params.get('drug') + '"');
    req.onload = function () {
        const data = JSON.parse(this.response).results[0];
        console.log(data);
        document.querySelector('.jumbotron h1').innerHTML = data.brand_name.toLowerCase();
        document.querySelector('.jumbotron p.lead').innerHTML = '';
        document.querySelector('form').innerHTML = '';
        document.querySelector('.drug-data').innerHTML += `
            <div class="container">
                <div class="row">
                    <div class="col-sm-10">
                        <h2 class="h3">Generic name</h2>
                        <p class="drugs">${data.generic_name.toString().toLowerCase()}</p>
                        <h2 class="h3">Manufacturer</h2>
                        <p class="drugs">${data.openfda.manufacturer_name[0].toLowerCase()}</p>
                        <h2 class="h3">Ingredients</h2>
                        <ul class="ingredients"></ul>
                        <h2 class="h3">Packaging</h2>
                        <p class="drugs">${data.packaging[0].description.toLowerCase()}</p>
                        <h2 class="h3">Type</h2>
                        <p class="drugs">${data.product_type.toString().toLowerCase()}</p>
                        <h2 class="h3">Route</h2>
                        <p class="drugs">${data.route.toString().toLowerCase()}</p>
                    </div >
                    <div class="col-sm-2">
                    <!--
                        <img src="/assets/img/icons/E307.png" class="md">
                        -->
                    </div>
                </div >
            </div >
        `;
        data.active_ingredients.forEach(ingredient => { document.querySelector('.ingredients').innerHTML += '<li class="drugs">' + ingredient.name.toLowerCase() + '</li>' });
    };
    req.send();
} else {
    document.body.removeChild(document.querySelector('.breadcrumb'));
    document.querySelector('form').onsubmit = function () {
        document.querySelector('.drug-list').innerHTML = '';
        req.open('GET', 'https://api.fda.gov/drug/ndc.json?search=brand_name:"' + this.children[0].children[1].value + '"');
        req.onload = function () {
            const data = JSON.parse(this.response).results;
            console.log(data)

            data.forEach(drug => {
                document.querySelector('.drug-list').innerHTML += `
        < div class="drug mb-5" >
            <div class="card">
                <div class="card-body">
                    <h2 class="h4 mb-2">
                        <a href="?drug=${drug.product_id}" class="stretched-link">
                            <img src="/assets/img/icons/E307.png" class="sm float-left mr-3 line">
                                ${drug.brand_name}
                                (${drug.generic_name})</a>
                    </h2>
                    <p>${drug.labeler_name}</p>
                </div>
            </div>
                </div > `;
            });
        };
        req.send();
        return false;
    };
}