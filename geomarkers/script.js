let loadMap;

require([
    'esri/Map', 'esri/layers/GeoJSONLayer', 'esri/views/MapView', 'esri/widgets/Compass'
], (Map, GeoJSONLayer, MapView, Compass) => {
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
                stops: [{ value: 0, opacity: 0.5 },
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
                                <p>Located at <a href="https://www.google.com/maps/place/{lat},{long}">{lat}, {long}.</a></p>
                                <p>{setting}.</p>
                                <p>{desc}.</p>
                                <p class="source">Data:
                                    <a href="https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl?PidBox={id}">USGS</a>
                                </p>
                                <p>
                                    <a href="https://geodesy.noaa.gov/cgi-bin/mark_recovery_form.prl?PID={id}&liteMode=true">Recovery form</a>
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
            map: map
        });
        view.ui.add(new Compass({ view: view }), 'top-right');
        view.on('immediate-click', e => {
            view.hitTest(e)
                .then((hit) => {
                    if (hit.results.length <= 1)
                        loadMap(e.mapPoint.latitude, e.mapPoint.longitude, 11)
                });
        })
    }

    fetch('https://raw.githubusercontent.com/Narlotl/markers/main/data/all.json').then(res => res.json()).then(async regions => {
        regions = [{ name: 'ca.json' }]
        for (const region of regions) try {
            await fetch('https://raw.githubusercontent.com/Narlotl/markers/main/data/' + region.name).then(res => res.json()).then(data => {
                for (const marker of data.markers) {
                    if (!marker.setting)
                        marker.setting = 'UNDEFINED SETTING';
                    markers.push({
                        type: 'Feature',
                        properties: {
                            id: marker.id,
                            setting: marker.setting.charAt(0) + marker.setting.toLowerCase().slice(1),
                            desc: marker.description,
                            lat: marker.lat,
                            long: marker.long,
                            found: marker.description.toLowerCase().includes('not found') ? 0 : 1
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [marker.long, marker.lat]
                        }
                    });
                }
                document.querySelector('.loading-markers > span').style.width = Math.round(markers.length / 778063 * 100) + '%';
            });
        } catch (e) { }
    }).then(() => {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(pos => loadMap(pos.coords.latitude, pos.coords.longitude, 11));
        else
            loadMap(38, -97, 3)
    });

});