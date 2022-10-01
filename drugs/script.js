const req = new XMLHttpRequest();
const params = new URLSearchParams(location.search);

if (params.has('drug')) {
    req.open('GET', 'https://api.fda.gov/drug/ndc.json?search=' + params.get('drug'));
    req.onload = function () {
        const data = JSON.parse(this.response).results[0];
        console.log(data);
        document.querySelector('.jumbotron h1').innerHTML = data.generic_name;
        document.querySelector('.jumbotron p').innerHTML = data.labeler_name;
        document.querySelector('.drug-data').innerHTML += `
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <h2 class="h4">Ingredients</h2>
                        <ul class="ingredients"></ul>
                        <h2 class="h4">Packaging</h2>
                        <p>${data.packaging[0].description}</p>
                        <h2 class="h4">Type</h2>
                        <p>${data.product_type}</p>
                        <h2 class="h4">Route</h2>
                        <p>${data.route}</p>
                    </div>
                </div>
            </div>
        `;
        data.active_ingredients.forEach(ingredient => { document.querySelector('.ingredients').innerHTML += '<li>' + ingredient.name + '</li>' });
    };
} else {
    req.open('GET', 'https://api.fda.gov/drug/ndc.json?limit=2');
    req.onload = function () {
        const data = JSON.parse(this.response).results;
        console.log(data);
        const deck = document.querySelector('.drugs .drug-list');
        data.forEach(drug => {
            deck.innerHTML += `
            <div class="drug">
                <a href="?drug=${drug.product_id}">
                    <div class="card button shadow">
                        <div class="card-body">
                            <h2 class="h5">
                                <i class="fa-solid fa-angle-right" style="float: right"></i> ${drug.generic_name}
                            </h2>
                        </div>
                    </div>
                </a>
            </div>`;
        });
    };
}
req.send();