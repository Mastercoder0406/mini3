maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: villa.geometry.coordinates, // starting position [lng, lat]
    zoom: 5 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(villa.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${villa.title}</h3><p>${villa.location}</p><br><h4>${villa.description}</h4> `
            )
    )
    .addTo(map)