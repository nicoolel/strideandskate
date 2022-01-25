const mapboxgl = require('mapbox-gl')
const mapboxToken = process.env.MAPBOX_TOKEN

module.exports = {
    getMap: async (req, res, next) => {
        try {
            mapboxgl.accessToken = mapboxToken
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-74.5, 40],
                zoom: 9})
            res.render("map.ejs")
        } catch (err) {
            console.log(err)
        }
        }
  }
 


