const select = document.querySelector('select#states');
const request = new XMLHttpRequest();
const states = new Array();
const populations = new Array();
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
  const vaccines = new Array();
  const vaccinesOld = new Array();
  //var masks = new Array();
  const sites = new Array();
  const stateCodes = [
    {
      "State": "Alabama",
      "Abbrev": "Ala.",
      "Code": "AL"
    },
    {
      "State": "Alaska",
      "Abbrev": "Alaska",
      "Code": "AK"
    },
    {
      "State": "Arizona",
      "Abbrev": "Ariz.",
      "Code": "AZ"
    },
    {
      "State": "Arkansas",
      "Abbrev": "Ark.",
      "Code": "AR"
    },
    {
      "State": "California",
      "Abbrev": "Calif.",
      "Code": "CA"
    },
    {
      "State": "Colorado",
      "Abbrev": "Colo.",
      "Code": "CO"
    },
    {
      "State": "Connecticut",
      "Abbrev": "Conn.",
      "Code": "CT"
    },
    {
      "State": "Delaware",
      "Abbrev": "Del.",
      "Code": "DE"
    },
    {
      "State": "District of Columbia",
      "Abbrev": "D.C.",
      "Code": "DC"
    },
    {
      "State": "Florida",
      "Abbrev": "Fla.",
      "Code": "FL"
    },
    {
      "State": "Georgia",
      "Abbrev": "Ga.",
      "Code": "GA"
    },
    {
      "State": "Hawaii",
      "Abbrev": "Hawaii",
      "Code": "HI"
    },
    {
      "State": "Idaho",
      "Abbrev": "Idaho",
      "Code": "ID"
    },
    {
      "State": "Illinois",
      "Abbrev": "Ill.",
      "Code": "IL"
    },
    {
      "State": "Indiana",
      "Abbrev": "Ind.",
      "Code": "IN"
    },
    {
      "State": "Iowa",
      "Abbrev": "Iowa",
      "Code": "IA"
    },
    {
      "State": "Kansas",
      "Abbrev": "Kans.",
      "Code": "KS"
    },
    {
      "State": "Kentucky",
      "Abbrev": "Ky.",
      "Code": "KY"
    },
    {
      "State": "Louisiana",
      "Abbrev": "La.",
      "Code": "LA"
    },
    {
      "State": "Maine",
      "Abbrev": "Maine",
      "Code": "ME"
    },
    {
      "State": "Maryland",
      "Abbrev": "Md.",
      "Code": "MD"
    },
    {
      "State": "Massachusetts",
      "Abbrev": "Mass.",
      "Code": "MA"
    },
    {
      "State": "Michigan",
      "Abbrev": "Mich.",
      "Code": "MI"
    },
    {
      "State": "Minnesota",
      "Abbrev": "Minn.",
      "Code": "MN"
    },
    {
      "State": "Mississippi",
      "Abbrev": "Miss.",
      "Code": "MS"
    },
    {
      "State": "Missouri",
      "Abbrev": "Mo.",
      "Code": "MO"
    },
    {
      "State": "Montana",
      "Abbrev": "Mont.",
      "Code": "MT"
    },
    {
      "State": "Nebraska",
      "Abbrev": "Nebr.",
      "Code": "NE"
    },
    {
      "State": "Nevada",
      "Abbrev": "Nev.",
      "Code": "NV"
    },
    {
      "State": "New Hampshire",
      "Abbrev": "N.H.",
      "Code": "NH"
    },
    {
      "State": "New Jersey",
      "Abbrev": "N.J.",
      "Code": "NJ"
    },
    {
      "State": "New Mexico",
      "Abbrev": "N.M.",
      "Code": "NM"
    },
    {
      "State": "New York",
      "Abbrev": "N.Y.",
      "Code": "NY"
    },
    {
      "State": "North Carolina",
      "Abbrev": "N.C.",
      "Code": "NC"
    },
    {
      "State": "North Dakota",
      "Abbrev": "N.D.",
      "Code": "ND"
    },
    {
      "State": "Ohio",
      "Abbrev": "Ohio",
      "Code": "OH"
    },
    {
      "State": "Oklahoma",
      "Abbrev": "Okla.",
      "Code": "OK"
    },
    {
      "State": "Oregon",
      "Abbrev": "Ore.",
      "Code": "OR"
    },
    {
      "State": "Pennsylvania",
      "Abbrev": "Pa.",
      "Code": "PA"
    },
    {
      "State": "Rhode Island",
      "Abbrev": "R.I.",
      "Code": "RI"
    },
    {
      "State": "South Carolina",
      "Abbrev": "S.C.",
      "Code": "SC"
    },
    {
      "State": "South Dakota",
      "Abbrev": "S.D.",
      "Code": "SD"
    },
    {
      "State": "Tennessee",
      "Abbrev": "Tenn.",
      "Code": "TN"
    },
    {
      "State": "Texas",
      "Abbrev": "Tex.",
      "Code": "TX"
    },
    {
      "State": "Utah",
      "Abbrev": "Utah",
      "Code": "UT"
    },
    {
      "State": "Vermont",
      "Abbrev": "Vt.",
      "Code": "VT"
    },
    {
      "State": "Virginia",
      "Abbrev": "Va.",
      "Code": "VA"
    },
    {
      "State": "Washington",
      "Abbrev": "Wash.",
      "Code": "WA"
    },
    {
      "State": "West Virginia",
      "Abbrev": "W.Va.",
      "Code": "WV"
    },
    {
      "State": "Wisconsin",
      "Abbrev": "Wis.",
      "Code": "WI"
    },
    {
      "State": "Wyoming",
      "Abbrev": "Wyo.",
      "Code": "WY"
    }
  ];
  var cdcRequest = new XMLHttpRequest();
  cdcRequest.open('GET', 'https://data.cdc.gov/resource/unsk-b7fc.json', true);
  cdcRequest.onload = function () {
    var data = JSON.parse(this.response);
    data.forEach(stat => {
      var date = new Date(stat.date);
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 2);
      var today = new Date();
      today.setDate(today.getDate() - 1);
      if (stat.location.length < 3 && date.getDate() == today.getDate())
        vaccines.push(stat);
      else if (date.getDate() == yesterday.getDate())
        vaccinesOld.push(stat);
    });
    vaccinesLoaded = false;/*
var maskRequest = new XMLHttpRequest();
maskRequest.open('GET', 'https://data.cdc.gov/resource/tzyy-aayg.json?$limit=50000', true);
maskRequest.onload = function () {
  var data = JSON.parse(this.response);
  data.forEach(mandate => {
    if (mandate.state_tribe_territory != 'PR' && mandate.state_tribe_territory != 'GU' && mandate.state_tribe_territory != 'VI' && mandate.state_tribe_territory != 'AS')
      if (mandate.date == '8/15/2021')
        if (mandate.face_masks_required_in_public != 'NA')
          masks.push(mandate.face_masks_required_in_public);
        else
          masks.push('No');
  });
  masksLoaded = false;
};
maskRequest.send();*/
    var locationsLoaded = false;
    if (location.hash != '') {
      var siteRequest = new XMLHttpRequest();
      siteRequest.open('GET', 'https://data.cdc.gov/resource/5jp2-pgaw.json?$limit=194000', true);
      siteRequest.onload = function () {
        var data = JSON.parse(this.response);
        data.forEach(location => {
          if (location.in_stock && !location.loc_name.includes('almart') && !location.loc_name.includes('afeway') && !location.loc_name.includes('algreens') && !location.loc_name.includes('CVS') && !location.loc_name.includes('ite Aid')) {
            sites.push(location);
          }
        });
        locationsLoaded = true;
        document.head.innerHTML += '<style>button#locations-button {height: 48px; visibility: inherit;}</style>';
        document.querySelector("#locations").innerHTML = '<div class="alert alert-success container" role="alert"><i class="fas fa-check-circle"></i> Vaccine sites loaded.</div><button id="locations-button" type="button" class="btn btn-primary btn-md find-site"><i class="fas fa-eye"></i> Show locations</button><div class="col-sm-9 float-right d-sm-block d-none"><iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA1G0PbkHalaKDxMUnZR9-RTM1g8QI5lq4&q=Centers+for+Disease+Control+and+Prevention,+1600+Clifton+Road,+Atlanta,+GA+30329+USA" frameborder="0"></iframe></div><div class="col-sm-3"></div>';
        document.querySelector('button#locations-button').onclick = locationsClick;
      }
      siteRequest.send();
    }
    var stateCode;
    var nationwide;
    var dataShown = false;
    var usPercent;
    select.onchange = function () {
      var siteRequest = new XMLHttpRequest();
      siteRequest.open('GET', 'https://data.cdc.gov/resource/5jp2-pgaw.json?$limit=194000', true);
      siteRequest.onload = function () {
        var data = JSON.parse(this.response);
        data.forEach(location => {
          if (location.in_stock && !location.loc_name.includes('almart') && !location.loc_name.includes('afeway') && !location.loc_name.includes('algreens') && !location.loc_name.includes('CVS') && !location.loc_name.includes('ite Aid')) {
            sites.push(location);
          }
        });
        locationsLoaded = true;
        document.head.innerHTML += '<style>button#locations-button {height: 48px; visibility: inherit;}</style>';
        document.querySelector("#locations").innerHTML = '<div class="alert alert-success container" role="alert"><i class="fas fa-check-circle"></i> Vaccine sites loaded.</div><button id="locations-button" type="button" class="btn btn-primary btn-md find-site"><i class="fas fa-eye"></i> Show locations</button><div class="col-sm-9 float-right d-sm-block d-none"><iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA1G0PbkHalaKDxMUnZR9-RTM1g8QI5lq4&q=Centers+for+Disease+Control+and+Prevention,+1600+Clifton+Road,+Atlanta,+GA+30329+USA" frameborder="0"></iframe></div><div class="col-sm-3"></div>';
        document.querySelector('button#locations-button').onclick = locationsClick;
      }
      siteRequest.send();
      htmlLocations = '';
      document.body.classList.remove('home');
      document.querySelectorAll('date').forEach(element => {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        element.innerHTML = yesterday.getMonth() + 1 + '/' + yesterday.getDate() + '/' + yesterday.getFullYear().toString()[2] + yesterday.getFullYear().toString()[3];
      });
      var sitesShown = 0;
      if (!dataShown) {
        document.head.innerHTML += '<style>img.icon {width: 0px; height: 0px;} div.select > div.col-sm-12 > div.alert {border: 1px solid var(--color-4);background-color: var(--color-4);}select {width: auto !important;height: calc(1.5em + .75rem + 2px) !important;font-size: 1rem !important; margin-bottom: 0px !important;}label > strong {font-size: 1rem;}label {padding-bottom: 0px;}div.form-group {margin: revert;text-align: left;display: flex !important;}div.row:not(div.row.select), div.container-fluid.locations {visibility: visible !important;height: 100% !important} div.state-icon {height:80px;}</style>';
        dataShown = true;
      }
      var vaccinesGiven;
      var yesterdayVaccinesGiven;
      stateCodes.forEach(state => {
        if (state.State == states[parseInt(select.value)])
          vaccines.forEach(vaccine => {
            if (vaccine.location == state.Code) {
              vaccinesGiven = parseInt(vaccine.series_complete_yes);
              vaccinesOld.forEach(old => {
                if (old.location == state.Code)
                  yesterdayVaccinesGiven = vaccinesGiven - old.series_complete_yes;
              });
            }
          });
      });
      var percent = Math.ceil((100 / (parseInt(populations[parseInt(select.value)]) / vaccinesGiven)) * 100) / 100;
      var oldPercent = Math.ceil((100 / (parseInt(populations[parseInt(select.value)]) / yesterdayVaccinesGiven)) * 100) / 100;
      var population = 0;
      populations.forEach(pop => {
        population += parseInt(pop);
      });
      usPercent = Math.ceil((100 / (population / nationwide)) * 100) / 100;
      document.querySelector('#name').innerHTML = states[parseInt(select.value)];
      document.querySelector("h5.vaccinated").innerHTML = vaccinesGiven.toLocaleString();
      document.querySelector('h5.pie-chart').innerHTML = percent + '%';
      document.querySelector("h5.vaccinated.yesterday").innerHTML = yesterdayVaccinesGiven.toLocaleString();
      document.querySelector('h5.pie-chart.yesterday').innerHTML = oldPercent + '%';
      //  document.querySelector('h5.mask').innerHTML = masks[parseInt(select.value)];
      stateCodes.forEach(code => {
        if (code.State == states[parseInt(select.value)]) {
          stateCode = code.Code;
          stateName = code.State;
        }
      });
      if (locationsLoaded)
        document.querySelector("#locations").innerHTML = '<div class="alert alert-success container" role="alert"><i class="fas fa-check-circle"></i> Vaccine sites loaded.</div><button id="locations-button" type="button" class="btn btn-primary btn-md find-site"><i class="fas fa-eye"></i> Show locations</button><div class="col-sm-9 float-right d-sm-block d-none"><iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA1G0PbkHalaKDxMUnZR9-RTM1g8QI5lq4&q=Centers+for+Disease+Control+and+Prevention,+1600+Clifton+Road,+Atlanta,+GA+30329+USA" frameborder="0"></iframe></div><div class="col-sm-3"></div>';
      if (locationsLoaded) {
        sites.every(site => {
          if (site.loc_admin_state == stateCode) {
            sitesShown++;
            htmlLocations += '<p onclick="try{document.querySelector(\'.address-selected\').classList.remove(\'address-selected\');}catch{}this.classList.add(\'address-selected\');document.querySelector(\'iframe\').src = \'https://www.google.com/maps/embed/v1/place?key=AIzaSyA1G0PbkHalaKDxMUnZR9-RTM1g8QI5lq4&q=' + site.loc_admin_street1 + ',+' + site.loc_admin_city + ',+' + site.loc_admin_state + ',+' + site.loc_admin_zip + '&zoom=15\';"><strong>' + site.loc_name + '</strong><br>' + '<a href="https://www.google.com/maps/place/' + site.loc_admin_street1 + ', ' + site.loc_admin_city + ', ' + site.loc_admin_state + ', ' + site.loc_admin_zip + '" target="_blank">' + site.loc_admin_street1 + ', ' + site.loc_admin_city + ', ' + site.loc_admin_state + ', ' + site.loc_admin_zip + '</a><br>' + site.loc_phone + '</p>';
          }
          return true;
        });
      }
      location.assign('#' + states[parseInt(select.value)]);
      document.querySelector("div.state-icon").style.mask = 'url("assets/img/states/' + stateCode + '.svg")';
      document.querySelector("div.state-icon").style.webkitMask = 'url("assets/img/states/' + stateCode + '.svg") no-repeat center';
      document.querySelector('button#locations-button').onclick = locationsClick;
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
  var addLocations = true;
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
    document.querySelector('div#locations > div.alert').innerHTML = '<i class="fas fa-check-circle"></i> Vaccine sites loaded. Click a location to view it on the map.';
    document.querySelector('div#locations > div.col-sm-3').innerHTML += htmlLocations;
    document.querySelector('iframe').style.height = '100vh';
  }
}
//LAST UPDATED AT 8:08AM 10/6/21 PDT