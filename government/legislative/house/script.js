const req = new XMLHttpRequest();
const params = new URLSearchParams(location.search);

if (params.has('member')) {
    document.querySelector('.member-list').innerHTML = '';
    req.open('GET', 'https://api.congress.gov/v3/member/' + params.get('member') + '?api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx');
    req.onload = function () {
        const data = JSON.parse(this.response).member;
        console.log(data);

        document.head.querySelector('title').innerHTML = 'Representative ' + data.directOrderName + ' - USA.govfresh';
        document.querySelector('.jumbotron h1').innerHTML = 'Representative ' + data.directOrderName;
        document.querySelector('.jumbotron p.lead').innerHTML = `${data.state} District ${data.district} (${data.party})`;
        document.querySelector('.member-data .col-sm-3').innerHTML = `
            <div class="fancy-2"><img class="rounded-circle xl mb-3 ${data.party.toLowerCase().replace(' ', '-')}" alt="${data.directOrderName}" src="${data.depiction.imageUrl || '/assets/img/icons/1F9D1-200D-1F4BC.png'}"></div>
        `;
        document.querySelector('.member-data .col-sm-9').innerHTML = `
            <h2>Contact</h2>
            <ul>
            <li>Mail: ${data.addressInformation.officeAddress}, ${data.addressInformation.city}, ${data.addressInformation.district}</li>
            <li>Phone: <a href="tel:${data.addressInformation.officeTelephone.phoneNumber}">${data.addressInformation.officeTelephone.phoneNumber}</a></li>
            <li>Website: <a href="${data.officialWebsiteUrl}">${new URL(data.officialWebsiteUrl).hostname}</a></li>
            </ul>
            <h2>Terms</h2>
            <ul class="terms"></ul>
            <h2>Sponsored legislation</h2>
            <ul class="legislation"></ul>
        `;
        document.querySelector('.source').innerHTML += `<p class="source">Photo: ${data.depiction.attribution || ''}</p>`;
        data.terms.reverse().forEach(term => {
            document.querySelector('ul.terms').innerHTML += `<li>${term.termBeginYear}-${term.termEndYear || 'Present'} (${term.chamber})</li>`
        });
        req.open('GET', data.sponsoredLegislation.url + '?format=json&limit=250&api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx');
        req.onload = function () {
            let leg = JSON.parse(this.response).sponsoredLegislation.filter(piece => { return piece.type != null; });
            for (let i = 0; i < leg.length; i++)
                leg[i].introducedDate = new Date(leg[i].introducedDate);
            leg.sort((a, b) => { return a.introducedDate.getTime() - b.introducedDate.getTime(); });
            const ul = document.querySelector('ul.legislation');
            if (leg.length == 0)
                ul.innerHTML += '<li>' + data.directOrderName + ' has not sponsored any legislation yet.</li>';
            leg.reverse().forEach(piece => {
                ul.innerHTML += `
                            <li>${piece.title} (${piece.introducedDate.toLocaleDateString()})</li>
                        `;
            });
        };
        req.send();
    };
}
else {
    req.open('GET', 'https://api.congress.gov/v3/member?api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx&limit=250');
    req.onload = function () {
        let data = JSON.parse(this.response);
        if (data.pagination.next) {
            req.open('GET', data.pagination.next + '&api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx');
            req.send();
        }
        data = data.members.filter(member => { return JSON.stringify(member.served).includes('"end":null') && member.district; }).sort((a, b) => { return a.name > b.name; });
        for (let i = 0; i < data.length; i++) {
            let deck;
            const member = data[i];
            let name = member.name.split(',');
            [name[0], name[1]] = [name[1], name[0]];
            name = name.toString().replaceAll(',', ' ');
            if (name.slice(-1) == '.')
                name = name.slice(0, -1);
            deck = document.querySelector('.reps');
            deck.innerHTML += `
            <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 d-flex align-items-stretch">
                <div class="card">
                    <div class="card-body">
                        <div class="fancy-2 ">
                            <img src="${member.depiction.imageUrl || '/assets/img/icons/1F9D1-200D-1F4BC.png'}" class="md rounded-circle mb-3 ${member.party.toLowerCase().replace(' ', '-')}" alt="Headshot of ${name}">
                        </div>
                        <h3 class="h5">
                            <a class="stretched-link" href="?member=${member.bioguideId}">${name}</a>
                        </h3>
                        <p class="description small">${member.state}, District ${member.district} (${member.party})</p>
                    </div>
                </div>
            </div>`;
        }
        document.querySelector('.loading2').innerHTML = '';
    };
}
req.send();