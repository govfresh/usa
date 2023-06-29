const select = document.querySelector('select#states');
const request = new XMLHttpRequest();
const states = [];
const populations = [];
let htmlLocations;
request.open('GET', 'https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=state:*', true);
request.onload = function () {
  const data = JSON.parse(this.response);
  for (let i = 0; i < data.length; i++)
    if (data[i][0] != 'NAME' && data[i][0] != 'Puerto Rico') {
      states.push(data[i][0]);
    }
  states.sort(function (a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  })
  states.forEach(state => {
    data.forEach(stat => {
      if (stat[0] == state)
        populations.push(stat[1]);
    });
  });
  states.forEach(state => {
    select.innerHTML += '<option value="' + Array.prototype.indexOf.call(states, state) + '">' + state + '</option>';
  });
  const vaccines = [];
  const vaccinesOld = [];
  const stateCodes = [
    {
      "State": "Alabama",
      "Code": "AL"
    },
    {
      "State": "Alaska",
      "Code": "AK"
    },
    {
      "State": "Arizona",
      "Code": "AZ"
    },
    {
      "State": "Arkansas",
      "Code": "AR"
    },
    {
      "State": "California",
      "Code": "CA"
    },
    {
      "State": "Colorado",
      "Code": "CO"
    },
    {
      "State": "Connecticut",
      "Code": "CT"
    },
    {
      "State": "Delaware",
      "Code": "DE"
    },
    {
      "State": "District of Columbia",
      "Code": "DC"
    },
    {
      "State": "Florida",
      "Code": "FL"
    },
    {
      "State": "Georgia",
      "Code": "GA"
    },
    {
      "State": "Hawaii",
      "Code": "HI"
    },
    {
      "State": "Idaho",
      "Code": "ID"
    },
    {
      "State": "Illinois",
      "Code": "IL"
    },
    {
      "State": "Indiana",
      "Code": "IN"
    },
    {
      "State": "Iowa",
      "Code": "IA"
    },
    {
      "State": "Kansas",
      "Code": "KS"
    },
    {
      "State": "Kentucky",
      "Code": "KY"
    },
    {
      "State": "Louisiana",
      "Code": "LA"
    },
    {
      "State": "Maine",
      "Code": "ME"
    },
    {
      "State": "Maryland",
      "Code": "MD"
    },
    {
      "State": "Massachusetts",
      "Code": "MA"
    },
    {
      "State": "Michigan",
      "Code": "MI"
    },
    {
      "State": "Minnesota",
      "Code": "MN"
    },
    {
      "State": "Mississippi",
      "Code": "MS"
    },
    {
      "State": "Missouri",
      "Code": "MO"
    },
    {
      "State": "Montana",
      "Code": "MT"
    },
    {
      "State": "Nebraska",
      "Code": "NE"
    },
    {
      "State": "Nevada",
      "Code": "NV"
    },
    {
      "State": "New Hampshire",
      "Code": "NH"
    },
    {
      "State": "New Jersey",
      "Code": "NJ"
    },
    {
      "State": "New Mexico",
      "Code": "NM"
    },
    {
      "State": "New York",
      "Code": "NY"
    },
    {
      "State": "North Carolina",
      "Code": "NC"
    },
    {
      "State": "North Dakota",
      "Code": "ND"
    },
    {
      "State": "Ohio",
      "Code": "OH"
    },
    {
      "State": "Oklahoma",
      "Code": "OK"
    },
    {
      "State": "Oregon",
      "Code": "OR"
    },
    {
      "State": "Pennsylvania",
      "Code": "PA"
    },
    {
      "State": "Rhode Island",
      "Code": "RI"
    },
    {
      "State": "South Carolina",
      "Code": "SC"
    },
    {
      "State": "South Dakota",
      "Code": "SD"
    },
    {
      "State": "Tennessee",
      "Code": "TN"
    },
    {
      "State": "Texas",
      "Code": "TX"
    },
    {
      "State": "Utah",
      "Code": "UT"
    },
    {
      "State": "Vermont",
      "Code": "VT"
    },
    {
      "State": "Virginia",
      "Code": "VA"
    },
    {
      "State": "Washington",
      "Code": "WA"
    },
    {
      "State": "West Virginia",
      "Code": "WV"
    },
    {
      "State": "Wisconsin",
      "Code": "WI"
    },
    {
      "State": "Wyoming",
      "Code": "WY"
    }
  ];
  let cdcRequest = new XMLHttpRequest();
  cdcRequest.open('GET', 'https://data.cdc.gov/resource/unsk-b7fc.json', true);
  cdcRequest.onload = function () {
    let data = JSON.parse(this.response);
    let wednesday = new Date('2023-05-10T00:00:00.000');
    let lastWeek = new Date(wednesday.getTime() - 604800000);
    data.forEach(stat => {
      const date = new Date(stat.date);
      if (stat.location.length < 3 && date.getDate() == wednesday.getDate())
        vaccines.push(stat);
      else if (date.getDate() == lastWeek.getDate())
        vaccinesOld.push(stat);
    });

    let siteRequest = new XMLHttpRequest();
    let locationsLoaded = false;
    if (location.hash != '') {
      siteRequest.open('GET', 'https://data.cdc.gov/resource/5jp2-pgaw.json?$limit=194000', true);
      siteRequest.onload = function () {
        let data = JSON.parse(this.response).filter(site => { return site.loc_admin_state == stateCodes[parseInt(select.value)].Code && site.in_stock });
        const regex = new RegExp(/safeway|walmart|walgreens|rite aid/g, 'i')
        data.forEach(location => {
          if (!location.loc_name.match(regex))
            htmlLocations += `<p onclick="try{document.querySelector('.address-selected').classList.remove('address-selected');}catch{}this.classList.add('address-selected');document.querySelector('iframe').src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyA1G0PbkHalaKDxMUnZR9-RTM1g8QI5lq4&q=${location.loc_admin_street1}, ${location.loc_admin_city}, ${location.loc_admin_state}, ${location.loc_admin_zip}&zoom=15';"><strong>${location.loc_name}</strong><br><a href="https://www.google.com/maps/place/${location.loc_admin_street1}, ${location.loc_admin_city}, ${location.loc_admin_state}, ${location.loc_admin_zip}" target="_blank">${location.loc_admin_street1.toLowerCase()}, ${location.loc_admin_city.toLowerCase()} ${location.loc_admin_state}, ${location.loc_admin_zip}</a><br>${location.loc_phone}</p>`;
        });
        locationsLoaded = true;
        document.head.innerHTML += '<style>button#locations-button {height: 48px; visibility: inherit;}</style>';
        document.querySelector("#locations").innerHTML = '<div class="alert alert-success container" role="alert"><i class="fas fa-check-circle"></i> Vaccine sites loaded.</div><button id="locations-button" type="button" class="btn btn-primary btn-md find-site"><i class="fas fa-eye"></i> Show locations</button><div class="col-sm-9 float-right d-sm-block d-none"><iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA1G0PbkHalaKDxMUnZR9-RTM1g8QI5lq4&q=Centers+for+Disease+Control+and+Prevention,+1600+Clifton+Road,+Atlanta,+GA+30329+USA" frameborder="0"></iframe></div><div class="col-sm-3"></div>';
        document.querySelector('button#locations-button').onclick = locationsClick;
      }
      siteRequest.send();
    }
    else
      document.querySelector('.breadcrumb').style.display = 'none';
    let stateCode;
    let nationwide;
    let dataShown = false;
    select.onchange = function () {
      location.hash = states[parseInt(select.value)];
      let siteRequest = new XMLHttpRequest();
      siteRequest.open('GET', 'https://data.cdc.gov/resource/5jp2-pgaw.json?$limit=194000', true);
      siteRequest.onload = function () {
        let data = JSON.parse(this.response).filter(site => { return site.loc_admin_state == stateCodes[parseInt(select.value)].Code && site.in_stock });
        data.forEach(location => {
          htmlLocations += `<p><strong>${location.loc_name}</strong><br><a href="https://www.google.com/maps/place/${location.loc_admin_street1}, ${location.loc_admin_city}, ${location.loc_admin_state}, ${location.loc_admin_zip}" target="_blank">${location.loc_admin_street1.toLowerCase()}, ${location.loc_admin_city.toLowerCase()} ${location.loc_admin_state}, ${location.loc_admin_zip}</a><br>${location.loc_phone}</p>`;
        });
        locationsLoaded = true;
        document.head.innerHTML += '<style>button#locations-button {height: 48px; visibility: inherit;}</style>';
        document.querySelector("#locations").innerHTML = '<div class="alert alert-success container" role="alert"><i class="fas fa-check-circle"></i> Vaccine sites loaded.</div><button id="locations-button" type="button" class="btn btn-primary btn-md find-site"><i class="fas fa-eye"></i> Show locations</button><div id="locations-list"></div>';
        document.querySelector('button#locations-button').onclick = locationsClick;
      }
      siteRequest.send();
      htmlLocations = '';
      document.body.classList.remove('home');
      if (!dataShown) {
        document.head.innerHTML += '<style>img.icon {width: 0px; height: 0px;} div.select > div.col-sm-12 > div.alert {border: 1px solid let(--color-4);background-color: let(--color-4);}select {width: auto !important;height: calc(1.5em + .75rem + 2px) !important;font-size: 1rem !important; margin-bottom: 0px !important;}label > strong {font-size: 1rem;}label {padding-bottom: 0px;}div.form-group {margin: revert;text-align: left;display: flex !important;}div.row:not(div.row.select), div.container-fluid.locations {visibility: visible !important;height: 100% !important}</style>';
        dataShown = true;
      }
      let vaccinesGiven;
      let lastWeekVaccines;
      stateCodes.forEach(state => {
        if (state.State == states[parseInt(select.value)]) {
          vaccines.forEach(vaccine => {
            if (vaccine.location == state.Code) {
              vaccinesGiven = parseInt(vaccine.series_complete_yes);
              vaccinesOld.forEach(old => {
                if (old.location == state.Code)
                  lastWeekVaccines = vaccinesGiven - old.series_complete_yes;
              });
            }
          });
        }
      });
      let percent = Math.ceil((100 / (parseInt(populations[parseInt(select.value)]) / vaccinesGiven)) * 100) / 100;
      let population = 0;
      populations.forEach(pop => {
        population += parseInt(pop);
      });
      document.querySelector('#name').innerHTML = states[parseInt(select.value)];
      document.querySelector("h5.vaccinated").innerHTML = vaccinesGiven.toLocaleString();
      document.querySelector('h5.pie-chart').innerHTML = percent + '%';
      try {
        document.querySelector("h5.vaccinated.yesterday").innerHTML = lastWeekVaccines.toLocaleString();
        document.querySelector('h5.pie-chart.yesterday').innerHTML = Math.ceil((100 / (parseInt(populations[parseInt(select.value)]) / lastWeekVaccines)) * 100) / 100 + '%';
      }
      catch (e) { console.error(e) }
      stateCodes.forEach(code => {
        if (code.State == states[parseInt(select.value)]) {
          stateCode = code.Code;
          stateName = code.State;
        }
      });
      document.querySelector('button#locations-button').onclick = locationsClick;
      document.querySelector('.breadcrumb').style.display = 'flex';
      document.querySelector('.jumbotron').style.display = 'none';
    };

    if (location.hash != '') {
      document.querySelectorAll('select > option').forEach(option => {
        if (option.innerHTML == location.hash.replace('#', '')) {
          option.selected = true;
          select.onchange();
        }
      })
    }
  };
  cdcRequest.send();
};
request.send();

function locationsClick() {
  let addLocations = true;
  try {
    htmlLocations = htmlLocations.replace('undefined', '');
  }
  catch (e) {
    alert(e)
    addLocations = false;
    select.onchange();
    document.querySelector('button#locations-button').onclick();
  }
  if (addLocations) {
    document.querySelector('div#locations > div.alert').innerHTML = '<i class="fas fa-check-circle"></i> Vaccine sites loaded.';
    document.querySelector('div#locations > div#locations-list').innerHTML += htmlLocations;
  }
}