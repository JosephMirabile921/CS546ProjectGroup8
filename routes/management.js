const express = require('express');
const router = express.Router();
const data = require('../data');
const user = data.users;
const hotel = data.hotels;

router.get('/', async (req, res) => {
    if(req.session.user == undefined ||req.session.user.Username !='admin'){
        res.status(500).json({error: 'You can not access this page without the permission.'});
    }else{
        const allHotels = await hotel.getAll();
        res.render('partials/management', {title : 'Hotel Management',hotels: allHotels});
    }
      
  });
router.get('/hotel/:id', async (req, res) => {
    if (!req.params.id) throw 'You must specify an ID to delete';
    console.log(req.params.id);
    try {
      await hotel.get(req.params.id);
    } catch (e) {
      res.status(404).json({ error: 'hotel not found' });
      return;
    }
    let pid = req.params.id;
    try {
      await hotel.remove(req.params.id);
      res.redirect('/management')
    } catch (e) {
      res.sendStatus(500);
    }
});
router.get('/addhotel', async (req, res) => {
    if(req.session.user == undefined ||req.session.user.Username !='admin'){
        res.status(500).json({error: 'You can not access this page without the permission.'});
    }else{
        res.render('partials/addhotel', {title : 'Add Hotel'});
    }
});

router.post('/addhotel', async (req, res) => {
    let hotelData = req.body;
    let name = hotelData.name;
    let phoneNumber = hotelData.phoneNumber;
    let website = hotelData.website;
    let address = hotelData.address;
    let city = hotelData.city;
    let state = hotelData.state;
    let zip = hotelData.zip;
    let amenities = hotelData.amenities;
    let nearbyAttractions = hotelData.nearbyAttractions;
    let images = hotelData.images;
    try{
      if(amenities.includes(",") == true){
        amenities = amenities.split(",")
      }else{
        amenities = [amenities]
      }
      if(nearbyAttractions.includes(",") == true){
        nearbyAttractions = nearbyAttractions.split(",")
      }else{
        nearbyAttractions = [nearbyAttractions]
      }
      const newHotel = await hotel.create(name, phoneNumber, website, address, city, state, zip, amenities, nearbyAttractions, images);
      if(newHotel['hotelInserted'] == true){
        res.redirect('/management');
      }else{
        res.status(500).json({error: 'Internal Server Error'});
      }
    }catch(e){
      res.status(400).render('partials/addhotel', {title : 'Add Hotel', error: e});
    }
  
  });



module.exports = router;