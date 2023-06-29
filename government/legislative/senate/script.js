const req = new XMLHttpRequest();
const params = new URLSearchParams(location.search);

if (params.has('member')) {
    document.querySelector('.member-list').innerHTML = '';
    req.open('GET', 'https://api.congress.gov/v3/member/' + params.get('member') + '?api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx&format=json');
    req.onload = function () {
        const data = JSON.parse(this.response).member;
        console.log(data);

        document.head.querySelector('title').innerHTML = 'Senator ' + data.directOrderName + ' - USA.govfresh';
        document.querySelector('.jumbotron h1').innerHTML = 'Senator ' + data.directOrderName;
        document.querySelector('.jumbotron p.lead').innerHTML = `${data.state} (${data.partyHistory[data.partyHistory.length - 1].partyName})`;
        document.querySelector('.member-data .col-sm-3').innerHTML = `
            <div class="fancy-2"><img class="rounded-circle xl mb-3 ${data.partyHistory[data.partyHistory.length - 1].partyName.toLowerCase().replace(' ', '-')}" alt="${data.directOrderName}" src="${data.depiction.imageUrl || '/assets/img/icons/1F9D1-200D-1F4BC.png'}"></div>
        `;
        document.querySelector('.member-data .col-sm-9').innerHTML = `
            <h2>Contact</h2>
            <ul>
            <li>Mail: ${data.addressInformation.officeAddress}</li>
            <li>Phone: <a href="tel:${data.addressInformation.officeTelephone.phoneNumber}">${data.addressInformation.officeTelephone.phoneNumber}</a></li>
            <li>Website: <a href="${data.officialWebsiteUrl}">${new URL(data.officialWebsiteUrl).hostname}</a></li>
            </ul>
            <h2>Terms</h2>
            <ul class="terms"></ul>
            <h2>Sponsored legislation</h2>
            <p class="source"></p>
            <ul class="legislation"></ul>
        `;
        document.querySelector('.source').innerHTML += `<p class="source">Photo source: ${data.depiction.attribution || ''}</p>`;
        data.terms.reverse().forEach(term => {
            document.querySelector('ul.terms').innerHTML += `<li>${term.termBeginYear}-${term.termEndYear || 'Present'} (${term.chamber})</li>`
        });
        req.open('GET', data.sponsoredLegislation.url + '?format=json&limit=250&api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx');
        req.onload = function () {
            let leg = JSON.parse(this.response).sponsoredLegislation.filter(piece => { return piece.type != null; });
            document.querySelector('p.source').innerText = '(' + leg.length + ' most recent)';
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
    let finishedLoading = false;
    let members = [];
    req.open('GET', 'https://api.congress.gov/v3/member?api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx&limit=250&format=json');
    req.onload = function () {
        let data = JSON.parse(this.response);
        finishedLoading = true;
        for (const member of data.members)
            if (member.terms && member.terms.item[member.terms.item.length - 1].chamber == 'Senate' && !member.terms.item[member.terms.item.length - 1].endYear) {
                finishedLoading = false;
                break;
            }
        if (!finishedLoading && data.pagination.next) {
            req.open('GET', data.pagination.next + '&api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx');
            req.send();
        }
        members = members.concat(data.members.filter(member => { return member.terms && member.terms.item[member.terms.item.length - 1].chamber == 'Senate' && !member.terms.item[member.terms.item.length - 1].endYear }));
        if (finishedLoading) {
            members = members.sort((a, b) => { return a.name > b.name; });
            for (let i = 0; i < members.length; i++) {
                let deck;
                const member = members[i];
                let name = member.name.split(',');
                [name[0], name[1]] = [name[1], name[0]];
                name = name.toString().replaceAll(',', ' ');
                if (name.slice(-1) == '.')
                    name = name.slice(0, -1);
                deck = document.querySelector('.senators');
                deck.innerHTML += `
             <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 d-flex align-items-stretch">
                 <div class="card">
                     <div class="card-body">
                         <div class="fancy-2 ">
                             <img src="${(member.depiction && member.depiction.imageUrl) ? member.depiction.imageUrl : '/assets/img/icons/1F9D1-200D-1F4BC.png'}" class="md rounded-circle mb-3 ${member.partyName.toLowerCase().replace(' ', '-')}" alt="Headshot of ${name}">
                         </div>
                         <h3 class="h5">
                             <a class="stretched-link" href="?member=${member.bioguideId}">${name}</a>
                         </h3>
                         <p class="description small">${member.state} (${member.partyName})</p>
                     </div>
                 </div>
             </div>`;
            }
            document.querySelector('.loading1').innerHTML = '';
        };
    }
}
req.send();