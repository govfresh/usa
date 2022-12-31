let loadMap;

require([
    'esri/Map', 'esri/layers/GeoJSONLayer', 'esri/views/MapView', 'esri/widgets/Compass', 'esri/widgets/Search'
], (Map, GeoJSONLayer, MapView, Compass, Search) => {
    const markers = new Array();

    loadMap = function (lat, long, zoom) {
        const nearbyMarkers = new Array();
        for (const marker of markers)
            if (Math.abs(marker.properties.lat - lat) <= 0.0723659 && Math.abs(marker.properties.long - long) <= 0.0918336)
                nearbyMarkers.push(marker);
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
                    content:
                        `<p>
                            <a href="https://usa.govfresh.com/geomarks?location={lat},{long}">Share</a>
                        </p>
                        <p>Location: <a href="https://www.google.com/maps/place/{lat},{long}">{lat}, {long}</a></p>
                        <p style="text-transform: capitalize">{setting}.</p>
                        <p style="text-transform: capitalize">{desc}.</p>
                        <p style="text-transform: capitalize">{history}</p>
                        <p>
                            <a href="https://geodesy.noaa.gov/cgi-bin/mark_recovery_form.prl?PID={id}&liteMode=true" class="btn btn-primary">Submit recovery</a>
                        </p>
                        <p class="source">Data:
                            <a href="https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl?PidBox={id}">U.S. National Geodetic Survey</a>
                        </p>`
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
        document.getElementById('map').innerHTML = '';
        const view = new MapView({
            container: 'map',
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
                    if (hit.results.length <= 1)
                        loadMap(e.mapPoint.latitude, e.mapPoint.longitude, view.zoom)
                });
        });
    }

    fetch('https://raw.githubusercontent.com/Narlotl/markers/main/data/all.json').then(res => res.json()).then(async regions => {
        regions = [{ file: 'ca0.json' }, { file: 'ca1.json' }, { file: 'ca2.json' }, { file: 'ca3.json' }, { file: 'ca4.json' }, { file: 'ca5.json' },]
        for (const region of regions) try {
            await fetch('https://raw.githubusercontent.com/Narlotl/markers/main/data/' + region.file).then(res => res.json()).then(data => {
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
                            setting: marker.setting.toLowerCase(),
                            desc: marker.description.toLowerCase(),
                            lat: marker.lat,
                            long: marker.long,
                            found: marker.description.toLowerCase().match(/(not found|not recovered|destroyed|no evidence of the mark|inaccessible|below the street|underground|under.* the street|station lost)/gm) ? 0 : 1,
                            history
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [marker.long, marker.lat]
                        }
                    });
                }
                // document.querySelector('.loading-markers > span').style.width = Math.round(markers.length / data.markers.length * 100) + '%';
            });
        } catch (e) { }
    }).then(() => {
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

});