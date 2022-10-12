const req = new XMLHttpRequest();
const params = new URLSearchParams(location.search);

if (params.has('job') && params.has('code')) {
    req.open('GET', 'https://data.usajobs.gov/api/codelist/positionscheduletypes');
    req.onload = function () {
        document.querySelector('.filter').innerHTML = '';
        document.querySelector('.sort').innerHTML = '';

        const scheduleMap = new Map();
        JSON.parse(this.response).CodeList[0].ValidValue.forEach(item => { scheduleMap.set(item.Code, item.Value) });

        req.open('GET', 'https://data.usajobs.gov/api/search?' + params);
        req.setRequestHeader('User-Agent', 'admin@govfresh.com');
        req.setRequestHeader('Authorization-Key', 'aJK6I8oFNizc/BUOqsEc2Uzv7I1On4wZRHa3iPYijEw=');
        req.onload = function () {
            const jobs = JSON.parse(this.response).SearchResult.SearchResultItems;
            jobs.forEach(job => {
                if (job.MatchedObjectId == params.get('job')) {
                    job = job.MatchedObjectDescriptor;
                    console.log(job)
                    document.querySelector('.breadcrumb-insert').innerHTML += `
                    <ol class="breadcrumb">
                        <li aria-current="page" class="breadcrumb-item">
                            <a href="/jobs/">Jobs</a>
                        </li>
                    </ol>`;
                    document.querySelector('.jumbotron h1').innerHTML = job.PositionTitle;
                    document.querySelector('.jumbotron h1').classList.add('h2');
                    document.querySelector('.jumbotron p').innerHTML = job.DepartmentName;
                    document.querySelector('.job-info').innerHTML += `
                        <div class="alert alert-primary p-3 mb-4 info-job">
                        <div class="container">
                            <div class="row">
                                <div class="col-4">
                                    <img src="/assets/img/icons/1F4B5.png" class="xs">
                                    <h2 class="h4">Salary/${job.PositionRemuneration[0].Description.substring(4).toLowerCase()}</h2>
                                    <p>$${parseInt(job.PositionRemuneration[0].MinimumRange).toLocaleString()} -
                                        $${parseInt(job.PositionRemuneration[0].MaximumRange).toLocaleString()}</p>
                                </div>
                                <div class="col-4">
                                    <img src="/assets/img/icons/1F5D3.png" class="xs">
                                    <h2 class="h4">Schedule</h2>
                                    <p>${scheduleMap.get(job.PositionSchedule[0].Code)}</p>
                                </div>
                                <div class="col-4">
                                    <img src="/assets/img/icons/1F3E0.png" class="xs">
                                    <h2 class="h4">Remote</h2>
                                    <p>${job.UserArea.Details.TeleworkEligible ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2>Agency</h2>
                    <div class="container">
                        <div class="row">
                            <div class="col-3">
                                <img src="/assets/img/icons/1F1FA-1F1F8.png" class="sm">
                            </div>
                            <div class="col-9 pt-4">
                                <p>${job.DepartmentName}<br>
                                    ${job.OrganizationName}</p>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-6">
                            </div>
                        </div>
                    </div>
                    <h2>Details</h2>
                    <div class="row">
                        <div class="col-12">
                            <div class="accordion mb-5">
                                <div class="accordion-item description">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="description" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#desc" data-bs-toggle="collapse" type="button">Description</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="desc">
                                        <div class="row">
                                            <p>${job.UserArea.Details.JobSummary}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item duties">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="duties" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#duties" data-bs-toggle="collapse" type="button">Duties</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="duties">
                                        <div class="row">
                                            <p>${job.UserArea.Details.MajorDuties}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item requirements">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="requirements" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#reqs" data-bs-toggle="collapse" type="button">Requirements</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="reqs">
                                        <div class="row">
                                            <ul class="requirements"></ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item education">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="education" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#ed" data-bs-toggle="collapse" type="button">Education</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="ed">
                                        <div class="row">
                                            <p>${job.UserArea.Details.Education}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item qualifications">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="qualifications" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#quals" data-bs-toggle="collapse" type="button">Qualifications</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="quals">
                                        <div class="row">
                                            <p>${job.QualificationSummary}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item documents">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="documents" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#docs" data-bs-toggle="collapse" type="button">Documents</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="docs">
                                        <div class="row">
                                            <p>${job.UserArea.Details.RequiredDocuments}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item openings">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="openings" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#openings" data-bs-toggle="collapse" type="button">Openings</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="openings">
                                        <div class="row">
                                            <p>${job.UserArea.Details.TotalOpenings}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item benefits">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="benefits" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#benefits" data-bs-toggle="collapse" type="button">Benefits</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="benefits">
                                        <div class="row">
                                            <p>${job.UserArea.Details.Benefits}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item other">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="other" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#other" data-bs-toggle="collapse" type="button">Other</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="other">
                                        <div class="row">
                                            <p>${job.UserArea.Details.OtherInformation}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item locations">
                                    <div class="row">
                                        <h3 class="accordion-header">
                                            <button aria-controls="locations" aria-expanded="true" class="accordion-button collapsed"
                                                data-bs-target="#locations" data-bs-toggle="collapse" type="button">Locations</button>
                                        </h3>
                                    </div>
                                    <div class="accordion-body collapse" id="locations">
                                        <div class="row">
                                            <ul class="locations"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <!--
                                        <h3>How to apply</h2>
                                        <p>${job.UserArea.Details.HowToApply}</p>
                                        <h3>What to expect</h2>
                                        <p>${job.UserArea.Details.WhatToExpectNext}</p>
                                        -->
                    <h2>Contact</h2>
                    <div class="container contact">
                        <div class="row">
                            ${(job.UserArea.Details.AgencyContactWebsite ?
                            `<div class="col-4">
                                <img src="/assets/img/icons/1F5A5.png" class="xs float-left mr-5">
                                <h3>Website</h3>
                                <p>
                                    <a
                                        href="${job.UserArea.Details.AgencyContactWebsite}">${job.UserArea.Details.AgencyContactWebsite.toLowerCase()}</a>
                                </p>
                            </div>`: '')}
                            ${(job.UserArea.Details.AgencyContactEmail ?
                            `<div class="col-4">
                                <img src="/assets/img/icons/2709.png" class="xs float-left">
                                <h3>Email</h3>
                                <p>
                                    <a
                                        href="mailto:${job.UserArea.Details.AgencyContactEmail}">${job.UserArea.Details.AgencyContactEmail.toLowerCase()}</a>
                                </p>
                            </div>`: '')}</div></div>
                    <h2 class="mb-4 mt-4">Apply</h2>
                    <div class="alert alert-primary info-job mb-5 mt-4 text-center">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-4 col-sm-12">
                                    <img src="/assets/img/icons/23F3.png" class="xs">
                                    <h3 class="h4">Deadline</h3>
                                    <p>${new Date(job.ApplicationCloseDate).toLocaleDateString()}</p>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <img src="/assets/img/icons/1F680.png" class="xs">
                                    <h3 class="h4">Get started</h3>
                                    <p><a href="${job.ApplyURI}">Apply</a></p>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <img src="/assets/img/icons/E258.png" class="xs">
                                    <h3 class="h4">USAJOBS</h3>
                                    <p><a href="${job.PositionURI}">View on USAJOBS</a></p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    try {
                        if (job.UserArea.Details.AgencyContactPhone.length >= 10) {
                            let number = job.UserArea.Details.AgencyContactPhone.toLowerCase().replaceAll(/-|\(|\)|\+| /gm, '');
                            let ext = '';
                            if (number.indexOf('x') != -1) {
                                ext = number.slice(number.indexOf('x'));
                                number = number.substring(0, number.indexOf('x'));
                            }
                            document.querySelector('.container.contact').innerHTML += `
                        <div class="col-4">
                        <img src="/assets/img/icons/1F4F1.png" class="xs float-left">
                            <h3>Phone</h3>
                            <p>
                            <a href="tel:${number}${ext}">
                            ${(number.length > 10 ? '+' + number.slice(0, -10) + ' ' : '') + '(' + number.substring(number.length - 10, number.length - 7) + ') ' + number.substring(number.length - 7, number.length - 4) + '-' + number.slice(-4)} ${ext}</a>
                        </p>
                        </div>`;
                        }
                    } catch (e) { }
                    document.querySelector('.job-info').innerHTML += '<h2>Categories</h2><p class="categories"></p';
                    job.UserArea.Details.KeyRequirements.forEach(requirement => { document.querySelector('.requirements ul').innerHTML += '<li>' + requirement + '</li>'; });
                    job.JobCategory.forEach(category => {
                        document.querySelector('.categories').innerHTML += `<a href="?category=${category.Code}">
                    <i class="fa-solid fa-tags" style="color: var(--color-1);"></i>
                    ${category.Name}
                </a>`;
                    });
                    job.PositionLocation.forEach(location => { document.querySelector('ul.locations').innerHTML += '<li>' + location.LocationName + '</li>'; });

                }
            });
            document.querySelector('.loading-include').removeChild(document.querySelector('.loading-include > *'));
            document.querySelectorAll('.accordion-body').forEach(element => {
                if (!/\S[A-z]*/gm.test(element.innerText))
                    element.parentElement.parentElement.removeChild(element.parentElement);
            });
        };
        req.send();
    };
    req.send();
} else {
    req.open('GET', 'https://data.usajobs.gov/api/search?' + params);
    req.setRequestHeader('User-Agent', 'admin@govfresh.com');
    req.setRequestHeader('Authorization-Key', 'aJK6I8oFNizc/BUOqsEc2Uzv7I1On4wZRHa3iPYijEw=');
    req.onload = function () {
        const jobs = JSON.parse(this.response).SearchResult.SearchResultItems;
        const cardDeck = document.querySelector('.job-list');

        jobs.forEach(job => {
            const id = job.MatchedObjectId;
            job = job.MatchedObjectDescriptor;

            cardDeck.innerHTML += `
                <div class="job" >
                    <div class="card">
                        <div class="card-body">
                            <h2 class="h5">
                                <a href="?job=${id}&code=${job.JobCategory[0].Code}">${job.PositionTitle}</a>
                            </h2>
                            <p>${job.OrganizationName}</p>
                            <p class="small">
                                <i>
                                    $${job.PositionRemuneration[0].MinimumRange.slice(0, -2)} - $${job.PositionRemuneration[0].MaximumRange.slice(0, -2)}${job.PositionRemuneration[0].Description.replace('Per ', '/').toLowerCase()}, ${job.PositionSchedule[0].Name.toLowerCase()}
                                </i>
                            </p>
                            <p>
                                <a href="${job.ApplyURI}">Apply</a>
                            </p>
                        </div>
                    </div>
                </div > `;
        });
        document.querySelector('.loading-include').removeChild(document.querySelector('.loading-include > *'));
    };
    req.send();
}