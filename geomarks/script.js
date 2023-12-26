fetch('states.geojson').then(res => res.json()).then(outlines => {
    let radius = 5, relocateOnClick = true;
    let blockedPhrases = ['not found', 'not recovered', 'destroyed', 'no evidence of the mark', 'inaccessible', 'below the street', 'underground', 'under the street', 'underneath the street', 'under the ground', 'underneath the ground', 'station lost', 'considered as lost', 'verified lost'];
    document.getElementById('block').value = blockedPhrases.join('\n');
    document.getElementById('options-form').onsubmit = e => {
        radius = parseInt(document.getElementById('radius').value);
        relocateOnClick = document.getElementById('relocate').checked;
        blockedPhrases = document.getElementById('block').value.split('\n');

        document.getElementById('options').style.display = 'none';
        start(currentPos);
        return false;
    };

    document.getElementById('recenter').onclick = () => {
        navigator.geolocation.getCurrentPosition(pos => start(pos.coords));
    };

    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    const map = L.map('map');
    L.tileLayer('https://api.mapbox.com/styles/v1/narlotl/clqfsdfzo006u01obcc0a9hsr/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmFybG90bCIsImEiOiJjbDRsa3o2bmExbjllM2RvYmlkdHUwMXMyIn0.Ca8O9VKGSooSTBHsQ2e72g', {
        maxZoom: 19
    }).addTo(map);
    L.control.scale().addTo(map);
    map.addControl(new L.Control.Search({
        autoCollapse: false,
        autoResize: false,
        autoType: false,
        collapsed: false,
        firstTipSubmit: true,
        marker: null,
        minLength: 2,
        propertyLoc: ["lat", "lon"],
        propertyName: "display_name",
        textPlaceholder: "Jump to...",
        moveToLocation: (latlng, title, map) => start({ latitude: latlng.lat, longitude: latlng.lng }),
        url: "https://nominatim.openstreetmap.org/search?format=json&q={s}"
    }));
    map.on('click', e => {
        if (relocateOnClick) {
            start({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        }
    });
    const markerLayer = L.layerGroup().addTo(map);
    let currentPos;

    const main = document.getElementById('main');

    const start = pos => {
        main.classList = 'loading-markers';

        const state = outlines.features.find(state => turf.booleanPointInPolygon([pos.longitude, pos.latitude], state.geometry)).properties.stusab;
        if (!state) return;

        currentPos = pos;
        map.setView([pos.latitude, pos.longitude], 12);
        markerLayer.clearLayers();

        let locator = L.circleMarker([pos.latitude, pos.longitude], {
            color: '#fff',
            fillColor: '#0076d6',
            fillOpacity: 1,
            radius: 8,
            weight: 1
        }).addTo(markerLayer);

        fetch('https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=' + state + '&data=id,description,latitude,longitude,history,marker,setting,stamping&location=' + pos.latitude + ',' + pos.longitude + '&radius=' + radius / 0.62137119).then(res => res.json()).then(data => {
            const markers = data.markers;
            for (let i = 0; i < markers.length; i++) {
                const marker = markers[i];
                //if (haversine(currentPos.latitude, currentPos.longitude, marker.latitude, marker.longitude) > radius) continue;
                let condition = 'MONUMENTED';
                if (marker.history.length > 0)
                    condition = marker.history[marker.history.length - 1].condition;
                let opacity = (condition == 'POOR' || condition == 'GOOD' || condition == 'MONUMENTED') ? 1 : 0.25;
                for (const blockedPhrase of blockedPhrases)
                    if (marker.description.toLowerCase().includes(blockedPhrase)) {
                        opacity = 0.25;
                        break;
                    }
                const mapMarker = L.circleMarker([marker.latitude, marker.longitude],
                    { color: '#fff', weight: 1, radius: 8, fillColor: '#000', opacity, fillOpacity: opacity }
                ).addTo(markerLayer);
                mapMarker.bindPopup(`
                <div style="max-height: 45vh; overflow-y: scroll">
                    <h2>${marker.id}</h2>
                    <p>Location: <a href="https://www.google.com/maps/place/${marker.latitude},${marker.longitude}" target="_blank">${marker.latitude}, ${marker.longitude}</a></p>
                    <p>${capitalizeFirstLetter(marker.marker || 'undefined')}${(marker.setting && !marker.setting.includes('UNSPECIFIED') && !marker.setting.includes('UNDEFINED')) ? ' set in ' + marker.setting.replace('set in ', '').toLowerCase() : ''}</p>
                    ${marker.stamping ? '<p>Stamped "' + marker.stamping + '"</p>' : ''}
                    <p style="text-transform: capitalize">${marker.description.toLowerCase()}</p>
                    <div class="container"><div id="images-placeholder></div></div>
                    <p>${marker.history.map(recovery => recovery.date.substring(0, 4) + ' - ' + capitalizeFirstLetter(recovery.condition)).join('<br>')}</p>
                    <p>
                        <a href="https://geodesy.noaa.gov/cgi-bin/mark_recovery_form.prl?PID=${marker.id}&liteMode=true" target="_blank" class="btn btn-primary">Submit recovery</a>
                    </p>
                    <p class="source">Data:
                        <a href="https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl?PidBox=${marker.id}" target="_blank">U.S. National Geodetic Survey</a>
                    </p>
                </div>
            `, { minWidth: 144 }).on('popupopen', () => {
                    if (mapMarker.getPopup().getContent().includes('<div id="images-placeholder></div>'))
                        fetch('https://us-central1-survey-markers.cloudfunctions.net/getImages?id=' + marker.id).then(res => res.json()).then(data => {
                            let html = '<div class="card-group clean pb-0 ">';
                            if (data.length > 0) {
                                for (const image of data)
                                    html += `
                                <div class="col-12 d-flex align-items-stretch">
                                    <div class="card">
                                        <img src="${image}">
                                    </div>
                                </div>`;
                                html += '</div>';
                            }
                            else
                                html = ''

                            mapMarker.setPopupContent(mapMarker.getPopup().getContent().replace('<div id="images-placeholder></div>', html));
                        });
                });
            }

            map.removeLayer(locator);
            locator.setLatLng(L.latLng(currentPos.latitude, currentPos.longitude));
            locator = locator.addTo(markerLayer);
            main.classList = '';
        });
    };

    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(pos => start(pos.coords));
    else
        start({ latitude: 39.833333, longitude: -98.583333 });
});