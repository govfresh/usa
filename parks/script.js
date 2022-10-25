const urlParams = new URLSearchParams(location.search);

const req = new XMLHttpRequest();
if (urlParams.has('park')) {
    req.open('GET', 'https://developer.nps.gov/api/v1/parks?api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L&parkCode=' + urlParams.get('park'))
    req.onload = function () {
        const data = JSON.parse(this.response).data[0];

        document.querySelector('.park-list').innerHTML = '';
        document.querySelector('.jumbotron h1').innerText = data.fullName;
        document.querySelector('.jumbotron h1').classList.add('h2');
        document.querySelector('.about .col-sm-10').innerText = data.description;
        document.title = data.fullName + '- USA.govfresh';

        data.images.forEach(image => {
            document.querySelector('#photos .card-deck').innerHTML += `
            <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 d-flex align-items-stretch">
                <div class="card">
                    <div class="card-body">
                            <img class="card-img-top lg line" src="${image.url}" alt="${image.altText}">
                        <h3 class="h5">
                            ${image.title}
                        </h3>
                    </div>
                </div>
            </div>
        `;
        });

        data.operatingHours.forEach(hours => {
            document.querySelector('div.park-info .hours .col-sm-10').innerHTML += `
            <p class="hours-${data.operatingHours.indexOf(hours)}">
                <p>
                    ${hours.description}
                </p>
            </p>`;

            document.querySelector('.hours-' + data.operatingHours.indexOf(hours)).innerHTML += '<p class="exceptions-parent"></p>';
            if (hours.exceptions.length > 0)
                document.querySelector(`.hours-${data.operatingHours.indexOf(hours)} .exceptions-parent`).innerHTML += '<i class="exceptions">Exceptions: </i>'
            hours.exceptions.forEach(exception => {
                if ((new Date(exception.startDate).getTime() - new Date().getTime()) / 31536000000 <= .5)
                    document.querySelector(`.hours-${data.operatingHours.indexOf(hours)} .exceptions`).innerHTML += `
                    ${new Date(exception.startDate).toLocaleString('en-US',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    —
                    ${new Date(exception.endDate).toLocaleString('en-US',
                            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}: ${exception.name}<br>`;
            });
        });

        data.activities.forEach(activity => {
            document.querySelector('.activities ul').innerHTML += `<li><a href="?activity=${activity.name.toLowerCase()}">${activity.name}</a></li>`;
        });

        document.querySelector('.website a').innerText = data.url;
        document.querySelector('.website a').href = data.url;
        data.contacts.phoneNumbers.forEach(phoneNumber => {
            document.querySelector('.call').innerHTML += `
            <li>${phoneNumber.type}: 
                <a href="tel:${phoneNumber.phoneNumber}">
                    ${phoneNumber.phoneNumber}
                </a>
            </li>`;
        });
        data.contacts.emailAddresses.forEach(email => {
            document.querySelector('.email').innerHTML += `
            <li>
                <a href="mailto:${email.emailAddress}">
                    ${email.emailAddress}
                </a>
            </li>`;
        });

        document.querySelector('.directions .col-sm-10').innerHTML += `
        <p>
            ${data.directionsInfo}
        </p>
        <p>
            ${data.addresses[0].line1}, ${data.addresses[0].city}, ${data.addresses[0].stateCode}
        </p>`;
        document.querySelector('iframe').src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyA1G0PbkHalaKDxMUnZR9-RTM1g8QI5lq4&q=' + data.name + ',' + data.addresses[0].line1 + ',' + data.addresses[0].city + ',' + data.addresses[0].stateCode;

        data.entranceFees.forEach(entranceFee => {
            document.querySelector('.entrance-fees ul').innerHTML += `
            <li>${entranceFee.title}: $${100 * entranceFee.cost / 100}
                <p>${entranceFee.description}</p>
            </li>`;
        });

        data.entrancePasses.forEach(pass => {
            document.querySelector('.passes ul').innerHTML += `
            <li>${pass.title}: $${100 * pass.cost / 100}
                <p>${pass.description}</p>
            </li>`;
        });

        data.fees.forEach(fee => {
            document.querySelector('.fees ul').innerHTML += `
            <li>${fee.title}: $${100 * fee.cost / 100}
                <p>${fee.description}</p>
            </li>`;
        });

        document.querySelector('.state .col-sm-10').innerHTML += data.states.replaceAll(',', ', ');
        if (data.states.includes(','))
            document.querySelector('.state .accordion-button').innerHTML += 's';

        let timeChange = 1;
        let currentTime = 1;
        document.querySelector('.previous').setAttribute('disabled', 'true');
        document.querySelector('.time-unit').onclick = function () {
            if (timeChange == 1) {
                document.querySelector('.time-unit').innerText = 'Day'
                timeChange = 24;
            }
            else {
                document.querySelector('.time-unit').innerText = 'Hour'
                timeChange = 1;
            }
            if (currentTime - timeChange < 1)
                document.querySelector('.previous').setAttribute('disabled', 'true');
            else if (document.querySelector('.previous').attributes.disabled)
                document.querySelector('.previous').attributes.removeNamedItem('disabled');
            if (currentTime + timeChange >= 156)
                document.querySelector('.next').setAttribute('disabled', 'true');
            else if (document.querySelector('.next').attributes.disabled)
                document.querySelector('.next').attributes.removeNamedItem('disabled');
        };
        document.querySelector('.previous').onclick = function () {
            currentTime -= timeChange;
            if (currentTime - timeChange < 1)
                this.setAttribute('disabled', 'true');
            if (currentTime + timeChange < 156 && document.querySelector('.next').attributes.disabled)
                document.querySelector('.next').attributes.removeNamedItem('disabled');
            weatherReq.onload();
        };
        document.querySelector('.next').onclick = function () {
            currentTime += timeChange;
            if (currentTime - timeChange >= 1 && document.querySelector('.previous').attributes.disabled)
                document.querySelector('.previous').attributes.removeNamedItem('disabled');
            if (currentTime + timeChange >= 156)
                this.setAttribute('disabled', 'true');
            weatherReq.onload();
        };

        const weatherReq = new XMLHttpRequest();
        weatherReq.open('GET', 'https://api.weather.gov/points/' + data.latitude + ',' + data.longitude);
        weatherReq.onload = function () {
            weatherReq.open('GET', JSON.parse(this.response).properties.forecastHourly);
            weatherReq.onload = function () {
                document.querySelector('.weather-data .col-sm-10 div').innerHTML = '';
                const data = JSON.parse(this.response).properties.periods[currentTime];
                document.querySelector('.weather-data .col-sm-10 div').innerHTML += `
                <p>${new Date(data.startTime).toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric' })}</p>
                <p>${data.temperature}° ${data.shortForecast}</p>
                <p>Wind: ${data.windSpeed} ${data.windDirection}</p>
                `;
            };
            weatherReq.send();
        };
        weatherReq.send();

        data.topics.forEach(topic => {
            document.querySelector('.tags').innerHTML += `
            <a href="?topic=${topic.id}">
                <i class="fa-solid fa-tags" style="color: var(--color-1);"></i>
                ${topic.name}
            </a>`;
        });

        req.open('GET', 'https://developer.nps.gov/api/v1/parkinglots?parkCode=' + data.parkCode + '&limit=1000&api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L');
        req.onload = function () {
            const lots = JSON.parse(this.response).data;
            lots.forEach(lot => {
                document.querySelector('.parking ul').innerHTML += `
                <li>
                    <p>
                        ${lot.name}
                    </p>
                    <p>
                        <i>
                            ${lot.description}
                        </i>
                    </p>
                    <p>
                        ${lot.liveStatus.isActive ? 'Lot is available and ' + ((lot.liveStatus.occupancy == 'Closed') ? 'closed.' : 'open.') : 'Lot is unavailable.'}
                    </p>
                    <p class="fees"></p>
                    <p>
                        ${lot.accessibility.isLotAccessibleToDisabled ? 'Lot is accessible to disabled people' : 'Lot is not accessible to disabled people'}:
                        ${lot.accessibility.totalSpaces} spaces, ${lot.accessibility.numberofAdaSpaces} accessible spaces.
                    </p>
                </li>`;
            });

            req.open('GET', 'https://developer.nps.gov/api/v1/articles?parkCode=' + data.parkCode + '&api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L&limit=1000');
            req.onload = function () {
                let articles = JSON.parse(this.response).data;
                const index = Math.round(Math.random() * (articles.length - 7));
                articles = articles.slice(index, index + 6);
                articles.forEach(article => {
                    document.querySelector('.articles ul').innerHTML += `
                    <li class="media mb-4">
                    <a href="${article.url}"><img class="mr-3 line" src="${article.listingImage.url}" alt="${article.listingImage.altText}"></a>
                        <div class="media-body">
                            <h5 class="mt-0 mb-1">
                                <a href="${article.url}">${article.title}</a>
                            </h5>
                            <p class="small">${article.listingDescription}</p>
                        </div>
                    </li>`;
                });

                req.open('GET', 'https://developer.nps.gov/api/v1/campgrounds?parkCode=' + data.parkCode + '&api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L');
                req.onload = function () {
                    const campgrounds = JSON.parse(this.response).data;
                    campgrounds.forEach(campground => {
                        document.querySelector('.campgrounds ul').innerHTML += `
                        <li>
                            <a href="${campground.url}">${campground.name}</a>
                        </li>`;
                    });

                    req.open('GET', 'https://developer.nps.gov/api/v1/multimedia/videos?parkCode=' + data.parkCode + '&api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L&limit=1000');
                    req.onload = function () {
                        let videos = JSON.parse(this.response).data;
                        if (videos.length != 0) {
                            let index = Math.round(Math.random() * (videos.length - 7));
                            if (index < 0)
                                index = 0;
                            videos = videos.slice(index, index + 6);
                            videos.forEach(video => {
                                document.querySelector('.videos .card-deck').innerHTML += `
                            <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 d-flex align-items-stretch">
                                <div class="card">
                                    <div class="card-body">
                                            <img class="card-img-top lg line" src="${video.splashImage.url}" alt="Video thumbnail for ${video.title}">
                                        <h3 class="h5">
                                            <a href="${video.permalinkUrl}" class="stretched-link"><i class="fa-solid fa-circle-play"></i> ${video.title}</a>
                                        </h3>
                                    </div>
                                </div>
                            </div>`;
                            });
                        }
                        else {
                            document.querySelector('.videos').innerHTML = '';
                            document.querySelector('.videos').classList = '';
                        }

                        document.querySelectorAll('.park-info ul ').forEach(ul => {
                            if (ul.innerHTML == '') {
                                ul.parentElement.parentElement.parentElement.parentElement.classList = '';
                                ul.parentElement.parentElement.parentElement.parentElement.innerHTML = '';
                            }
                        });
                        document.querySelectorAll('img[src=""]').forEach(img => {
                            img.src = 'https://www.nps.gov/common/commonspot/templates/images/logos/nps_social_image_02.jpg';
                        });
                    };
                    req.send();
                };
                req.send();
            };
            req.send();
        };
        req.send();

        document.querySelector('.loading-include').removeChild(document.querySelector('.loading-include>*'));
        /*
        Things to do - long
        */
    }
}
else {
    document.querySelector('.tags').innerHTML = '';
    document.querySelector('.park-data').innerHTML = '';
    document.body.removeChild(document.querySelector('.breadcrumb'));

    if (urlParams.has('activity')) {
        document.querySelector('.jumbotron h1').innerText += ' with ' + urlParams.get('activity');
        req.open('GET', 'https://developer.nps.gov/api/v1/activities/parks?q=' + urlParams.get('activity') + '&limit=500&api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L');
    }
    else if (urlParams.has('topic')) {
        req.open('GET', 'https://developer.nps.gov/api/v1/topics/parks?id=' + urlParams.get('topic') + '&limit=500&api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L');
    }
    else
        req.open('GET', 'https://developer.nps.gov/api/v1/parks?api_key=fvA9u4qpBK9EY8vGLkPI55IDAh2qO0ImrORbmr0L&limit=10000');
    req.onload = function () {
        let data = JSON.parse(this.response);
        if (urlParams.has('activity') || urlParams.has('topic')) {
            if (urlParams.has('topic'))
                document.querySelector('.jumbotron h1').innerText += ' tagged ' + data.data[0].name;
            data = data.data[0].parks;
        }
        else
            data = data.data;
        data.forEach(park => {
            document.querySelector('.park-list').innerHTML += `
        <div class="park">
            <a href="?park=${park.parkCode}">
                <div class="card button">
                    <div class="card-body">
                        <h2 class="h5">
                            <i class="fa-solid fa-angle-right" style="float: right"></i> ${park.fullName}
                        </h2>
                    </div>
                </div>
            </a>
        </div>`;
        });
        document.querySelector('.loading-include').removeChild(document.querySelector('.loading-include>*'));
    };
}
req.send();