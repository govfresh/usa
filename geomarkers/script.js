require([
    'esri/Map', 'esri/layers/GeoJSONLayer', 'esri/views/MapView'
], (Map, GeoJSONLayer, MapView) => {
    const markers = new Array();

    function loadMap(lat, long, zoom) {
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
            }
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
        const view = new MapView({
            container: 'map',
            center: [
                long, lat
            ],
            zoom: zoom,
            map: map
        });
        view.on('immediate-click', e => {
            view.hitTest(e)
                .then((hit) => {
                    if (hit.results.length <= 1)
                        loadMap(e.mapPoint.latitude, e.mapPoint.longitude, 11)
                });
        })
    }

    fetch('https://raw.githubusercontent.com/Narlotl/markers/main/data/all.json').then(res => res.json()).then(async regions => {
        regions = regions.slice(10, 15);
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
                            long: marker.long
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [marker.long, marker.lat]
                        }
                    });
                }
            });
        } catch (e) { }
    }).then(() => {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(pos => {
                loadMap(pos.coords.latitude, pos.coords.longitude, 11);
            });
        else
            loadMap(38, -97, 3)
    });
});