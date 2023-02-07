let loadMap, view, relocate = true, radius = 5;
let blockedPhrases = ['not found', 'not recovered', 'destroyed', 'no evidence of the mark', 'inaccessible', 'below the street', 'underground', 'under.* the (street|ground)', 'station lost', 'considered as lost', 'verified lost'];
document.querySelector('textarea#block').value = blockedPhrases.join('\n');
document.querySelector('input#radius').value = radius;
document.querySelector('input#relocate').checked = relocate;

document.querySelector('.options form').onsubmit = () => {
    blockedPhrases = document.querySelector('textarea#block').value.length > 0 ? document.querySelector('textarea#block').value.split('\n') : [];
    radius = parseInt(document.querySelector('input#radius').value);
    relocate = document.querySelector('input#relocate').checked;
    if (view)
        loadMap(view.center.latitude, view.center.longitude, view.zoom, true);
    document.querySelector('.overlay.options').style.display = 'none'
    return false;
};

require([
    'esri/Map', 'esri/layers/GeoJSONLayer', 'esri/views/MapView', 'esri/widgets/Compass', 'esri/widgets/Search'
], (Map, GeoJSONLayer, MapView, Compass, Search) => {
    let markers = new Array(), states = new Array();

    loadMap = function (lat, long, zoom, reload) {
        const bar = document.querySelector('.bar');
        fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + long + '&format=json').then(res => res.json()).then(location =>
            fetch('https://raw.githubusercontent.com/Narlotl/markers/main/data/all.json').then(res => res.json()).then(async regions => {
                if (reload) {
                    states = [];
                    markers = []
                }
                for (const region of regions)
                    if (region.location == location.address.state && (reload || !states.includes(location.address.state))) try {
                        bar.style.width = '0';
                        document.querySelector('#map').style.display = 'none';
                        document.querySelector('.loading-markers').style.display = 'block';
                        states.push(location.address.state);
                        let filesLoaded = 0;
                        if (typeof region.file == 'string')
                            region.file = [region.file];
                        for (const file of region.file)
                            await fetch('https://raw.githubusercontent.com/Narlotl/markers/main/data/' + file).then(res => res.json()).then(data => {
                                for (const marker of data.markers) {
                                    let history = '';
                                    marker.history.forEach(recovery => {
                                        history += recovery.date.substring(0, 4) + ' - ' + recovery.condition.toLowerCase().replace('see', 'see description') + '<br>';
                                    });
                                    if (!marker.setting)
                                        marker.setting = 'UNDEFINED SETTING';
                                    markers.push({
                                        type: 'Feature',
                                        properties: {
                                            id: marker.id,
                                            setting: (marker.setting.includes('SET IN') ? '' : 'set in ') + marker.setting.toLowerCase(),
                                            desc: marker.description.toLowerCase(),
                                            type: marker.marker.toLowerCase(),
                                            lat: marker.lat,
                                            long: marker.long,
                                            found: (marker.description.toLowerCase().match(new RegExp(blockedPhrases.join('|'), 'gm')) && blockedPhrases.length > 0) ? 0 : ((history.includes('not found') && blockedPhrases.length > 0) ? 0 : 1),
                                            history
                                        },
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [marker.long, marker.lat]
                                        }
                                    });
                                }
                                filesLoaded++;
                                bar.style.width = filesLoaded / region.file.length * 100 + '%';
                            });
                        break;
                    } catch (e) { }
            }).then(() => {
                setTimeout(() => {
                    const nearbyMarkers = new Array();
                    for (const marker of markers) {
                        const long1 = marker.properties.long * Math.PI / 180,
                            long2 = long * Math.PI / 180,
                            lat1 = marker.properties.lat * Math.PI / 180,
                            lat2 = lat * Math.PI / 180;
                        if (3963 * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2)
                            + Math.cos(lat1) * Math.cos(lat2)
                            * Math.pow(Math.sin((long1 - long2) / 2), 2))) <= radius)
                            nearbyMarkers.push(marker);
                    }
                    const renderer = {
                        type: 'simple',
                        symbol: {
                            type: 'simple-marker',
                            color: 'black',
                            outline: {
                                color: 'white',
                            }
                        },
                        visualVariables: [{
                            type: "opacity",
                            field: "found",
                            stops: [{ value: 0, opacity: 0.25 },
                            { value: 1, opacity: 1 }]
                        }]
                    };
                    const map = new Map({
                        basemap: 'streets-navigation-vector', layers: [new GeoJSONLayer({
                            url: URL.createObjectURL(new Blob([JSON.stringify({
                                type: 'FeatureCollection',
                                features: nearbyMarkers
                            })])),
                            popupTemplate: {
                                title: '{id}',
                                content: `
                                    <p>Location: <a href="https://www.google.com/maps/place/{lat},{long}">{lat}, {long}</a></p>
                                    <p style="text-transform: capitalize">{type} {setting}.</p>
                                    <p style="text-transform: capitalize">{desc}</p>
                                    <p style="text-transform: capitalize">{history}</p>
                                    <p>
                                        <a href="https://geodesy.noaa.gov/cgi-bin/mark_recovery_form.prl?PID={id}&liteMode=true" class="btn btn-primary">Submit recovery</a>
                                    </p>
                                    <p class="source">Data:
                                        <a href="https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl?PidBox={id}">U.S. National Geodetic Survey</a>
                                    </p>
                                    <p><a href="https://usa.govfresh.com/geomarks?location={lat},{long}">Share</a></p>`
                            },
                            renderer
                        })]
                    });
                    renderer.symbol.color = '#0076d6';
                    map.add(new GeoJSONLayer({
                        url: URL.createObjectURL(new Blob([JSON.stringify({
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [long, lat]
                                }
                            }]
                        })])),
                        renderer
                    }));
                    view = new MapView({
                        center: [
                            long, lat
                        ],
                        zoom: zoom,
                        map: map,
                    });
                    view.popup.dockOptions = { position: 'top-right' };
                    const search = new Search({
                        view: view
                    });
                    search.on('search-complete', e => loadMap(e.results[0].results[0].extent.center.latitude, e.results[0].results[0].extent.center.longitude, 11));
                    view.ui.add(search, {
                        position: "bottom-right",
                    });
                    view.ui.add(new Compass({ view: view }), 'top-right');
                    view.on('immediate-click', e => {
                        view.hitTest(e)
                            .then((hit) => {
                                if (relocate && hit.results.length <= 1)
                                    loadMap(e.mapPoint.latitude, e.mapPoint.longitude, view.zoom)
                            });
                    });
                    view.container = 'map';
                    document.querySelector('#map').style.display = 'flex';
                    document.querySelector('.loading-markers').style.display = 'none';
                }, 1000);
            }));
    }
    const params = new URLSearchParams(location.search);
    if (params.has('location')) {
        const location = params.get('location').split(',');
        loadMap(location[0], location[1], 11);
    }
    else if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(pos => loadMap(pos.coords.latitude, pos.coords.longitude, 11));
    else
        loadMap(38, -97, 3)
});