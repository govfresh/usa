const req = new XMLHttpRequest();
if (location.search != '') {
    req.open('GET', 'https://www.federalregister.gov/api/v1/agencies/' + location.search.substring(location.search.indexOf('=') + 1), true);
    req.onload = function () {
        const agency = JSON.parse(this.response);
        let img = '';
        if (agency.logo != null && agency.logo.medium_url != null && agency.short_name != 'USAID')
            img = '<img class="line md p-3 rounded" alt="' + agency.name + ' logo" src="' + agency.logo.medium_url + '">';
        else
            img = '<img class="line md p-3 rounded" alt="' + agency.name + ' logo" src="assets/img/seal.png">';
        let parent_html = '';
        if (agency.parent_id != null)
            parent_html = '<li class="list-group-item"><a href="?agency-id=' + agency.parent_id + '"><i class="fa-solid fa-university"></i> Parent agency</a></li>';
        let website = '';
        if (agency.html_url != null)
            website = '<li class="list-group-item"><a href="' + agency.agency_url + '"><i class="fas fa-window-maximize fa-lg"></i> Website</a></li>';
        let short_name_text = '';
        let latest_short_name = '';
        if (agency.short_name != null) {
            short_name_text = ' (' + agency.short_name + ')';
            latest_short_name = '<p class="lead">Latest ' + agency.short_name + ' documents published to the Federal Register.</p>'
        }
        else
            latest_short_name = '<p class="lead">Latest ' + agency.name + ' documents published to the Federal Register.</p>'
        document.querySelector('div.agency-data').innerHTML += '<div class="jumbotron"><div class="container"><div class="row"><div class="col-sm-12"><h1>' + agency.name + short_name_text + '</h1></div></div></div></div><div class="container"><div class="row"><div class="col-sm-3">' + img + '<ul class="list-group list-group-flush">' + website + parent_html + '</ul></div><div class="col-sm-9 post"><h2>About</h2><p>' + agency.description.replaceAll(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>') + '</p></div></div></div><div class="container children"><div class="row"><div class="col-sm-12"><h2>Agencies</h2></div></div><div class="row"><div class="col-sm-12"><div class="card-deck"><div class="col-sm-12 col-md-6 col-lg-3 d-flex align-items-stretch children"><ul class="children"></ul></div></div></div></div></div></div><div class="container"><div class="row"><div class="col-sm-12"><h2>Documents</h2>' + latest_short_name + '</div></div><div class="card-deck">';
        const post_req = new XMLHttpRequest();
        post_req.open('GET', agency.recent_articles_url, true);
        post_req.onload = function () {
            const posts = JSON.parse(this.response).results;
            for (let i = 0; i < 6; i++) {
                document.querySelectorAll('div.agency-data .container .card-deck')[document.querySelectorAll('div.agency-data .container .card-deck').length - 1].innerHTML += '<div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 d-flex align-items-stretch"><div class="card"><div class="card-body"><i class="fa-solid fa-satellite-dish fa-2x"></i><h3 class="h4"><a target="_blank" href="' + posts[i].html_url + '" class="stretched-link">' + posts[i].title + '</a></h3><p><small>' + new Date(posts[i].publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</small></p></div></div></div>'
            }
        };
        post_req.send();
        if (agency.child_ids.length != 0)
            agency.child_ids.forEach(child_id => {
                const child_req = new XMLHttpRequest();
                child_req.onload = function () {
                    const child = JSON.parse(this.response);
                    document.querySelector('ul.children').innerHTML += '<div class="card d-inline"><a href="?agency-id=' + child.id + '">' + child.name + '</a></div>';
                }
                child_req.open('GET', 'https://www.federalregister.gov/api/v1/agencies/' + child_id, true);
                child_req.send();
            });
        else
            document.querySelector('div.container.children').innerHTML = '';
    }
}
else {
    document.querySelector('div.jumbo-insert').innerHTML = '<div class="jumbotron"><div class="container"><div class="row"><div class="col-sm-12"><h1>Government</h1><p class="lead">Official U.S. government agencies.</p></div></div></div></div>'
    req.open('GET', 'https://www.federalregister.gov/api/v1/agencies', true);
    req.onload = function () {
        const agencies = JSON.parse(this.response);
        let angency_number = 0;
        for (let i = 0; i < agencies.length; i++) {
            let agency = agencies[i];
            if (agency.parent_id != null || agency.short_name == "ACTION")
                continue;
            let img = '';
            if (agency.logo != null && agency.short_name != 'USAID')
                img = '<img class="agency_logo card-img-top md" src="' + agency.logo.medium_url + '">';
            else
                img = '<img class="agency_logo card-img-top md" src="assets/img/seal.png">';
            document.querySelectorAll('div.agencies div.row')[document.querySelectorAll('div.agencies div.row').length - 1].innerHTML += '<div class="col-sm-12 col-md-6 col-lg-3 d-flex align-items-stretch"><a href="?agency-id=' + agency.id + '"><div class="card d-inline">' + img + '<div class="card-body">' + '<h2 class="h5">' + agency.name + '</h2></div></a></div></div>';
            angency_number++;
        }
    };
}
req.send();
req.onloadend = function () { document.querySelector('.loading').parentElement.removeChild(document.querySelector('.loading')); }