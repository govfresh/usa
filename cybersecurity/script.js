window.onhashchange = () => {
    try {
        document.querySelector('a.nav-link.active').classList.remove('active');
        document.querySelector(`a.nav-link[href='${location.hash}']`).classList.add('active');
    } catch (e) { }
    if (location.hash.length > 2) {
        document.querySelector('.row.post .posts').innerHTML = '';
        if (location.hash == '#all') {
            let posts = new Array();
            fetch('https://api.rss2json.com/v1/api.json?api_key=ljjuizqbsfmj2meszzzqf8ymzggnwy7jd5wbx2l4&rss_url=https://www.cisa.gov/uscert/ncas/alerts.xml').then(res => res.json()).then(data => {
                data.items.forEach((post) => { post.type = 'alert'; posts.push(post) }); fetch('https://api.rss2json.com/v1/api.json?api_key=ljjuizqbsfmj2meszzzqf8ymzggnwy7jd5wbx2l4&rss_url=https://www.cisa.gov/uscert/ncas/bulletins.xml').then(res => res.json()).then(data => {
                    data.items.forEach((post) => { post.type = 'bulletin'; posts.push(post) }); fetch('https://api.rss2json.com/v1/api.json?api_key=ljjuizqbsfmj2meszzzqf8ymzggnwy7jd5wbx2l4&rss_url=https://www.cisa.gov/uscert/ncas/analysis-reports.xml').then((res => res.json())).then(data => {
                        data.items.forEach((post) => { post.type = 'tip'; posts.push(post) }); fetch('https://api.rss2json.com/v1/api.json?api_key=ljjuizqbsfmj2meszzzqf8ymzggnwy7jd5wbx2l4&rss_url=https://www.cisa.gov/uscert/ncas/current-activity.xml').then(res => res.json()).then(data => {
                            data.items.forEach((post) => { post.type = 'current activity'; posts.push(post); });
                        }).then(() => {
                            posts.sort((a, b) => {
                                return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
                            }).reverse().forEach(post => {
                                document.querySelector('.row.post .posts').innerHTML += `
                                    <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 d-flex align-items-stretch">
                                        <div class="card">
                                            <div class="card-body">
                                                <i class="fa-solid fa-satellite-dish fa-2x"></i>
                                                <h3 class="h4">
                                                    <a href="${post.link}" target="_blank">${post.title}</a>
                                                </h3>
                                                <small>
                                                    <div>${new Date(post.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                    <a class="tag" href="#${post.type.replace(' ', '-')}">${post.type}</a>
                                                </small>
                                            </div>
                                        </div>
                                    </div>`;
                            });
                            document.querySelector('.loading-include').removeChild(document.querySelector('.loading-include > *'));
                        });
                    });
                });
            });
        }
        else
            getFeed(location.hash.substring(1));
    }
}

window.onload = function () {
    if (location.hash.length < 2)
        location.hash = 'all';
    window.onhashchange();
};

function getFeed(feed) {
    const req = new XMLHttpRequest();
    req.open('GET', `https://api.rss2json.com/v1/api.json?api_key=ljjuizqbsfmj2meszzzqf8ymzggnwy7jd5wbx2l4&rss_url=https://www.cisa.gov/uscert/ncas/${feed}.xml`, true);
    req.onload = function () {
        console.log(JSON.parse(this.response))
        JSON.parse(this.response).items.forEach(post => {
            document.querySelector('.row.post .posts').innerHTML += `
            <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 d-flex align-items-stretch">
                <div class="card">
                    <div class="card-body">
                        <i class="fa-solid fa-satellite-dish fa-2x"></i>
                        <h3 class="h4">
                            <a href="${post.link}" target="blank">${post.title}</a>
                        </h3>
                        <small>${new Date(post.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                    </div>
                </div>
            </div>`;
        });
        document.querySelector('.loading-include').removeChild(document.querySelector('.loading-include > *'));
    };
    req.send();
}