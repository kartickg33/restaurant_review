const Restaurant = require('../models/restaurant');
const {cloudinary} = require('../cloudinary')
const mapBoxToken=process.env.MAPBOX_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const geocoder = mbxGeocoding({accessToken:mapBoxToken});



module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
}

module.exports.newRestaurant = (req, res) => {
    res.render('restaurants/new');
}

module.exports.createRestaurant = async (req, res, next) => {
   const geoData = await  geocoder.forwardGeocode({
        query: req.body.restaurant.location,
        limit: 1
    }).send()
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.geometry = geoData.body.features[0].geometry;
    restaurant.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    restaurant.author = req.user._id;
    await restaurant.save();
    console.log(restaurant)
    req.flash('success', 'Restaurant added successfully !');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.displayRestaurant = async (req, res,) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Restaurant not found !');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}

module.exports.editRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id)
    if (!restaurant) {
        req.flash('error', 'Restaurant not found !');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurant });
}
//continue from here in the morning 
// do not forget to change the mongodb uri 
//change all the styling
//you will be able to do it..
//so keep working .......keeep up
module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    restaurant.images.push(...imgs);
    await restaurant.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await restaurant.updateOne({$pull: {images: {filename: {$in:req.body.deleteImages}}}})
        //console.log(campground);
    }
    console.log(req.body);
    req.flash('success', 'Successfully updated Restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted restaurant')
    res.redirect('/restaurants');
}