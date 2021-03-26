const express = require('express');
const router = express.Router();
const restaurants = require('../controllers/restaurants');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateRestaurant } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage})
const Restaurant = require('../models/restaurant');

router.route('/')
    .get(catchAsync(restaurants.index))
    .post(isLoggedIn, upload.array('image'), validateRestaurant,catchAsync(restaurants.createRestaurant))
    // .post(upload.array('image'), (req,res)=>{
    //     console.log(req.body,req.files);
    //     res.send("It's working")
    //  })

router.get('/new', isLoggedIn, restaurants.newRestaurant)

router.route('/:id')
    .get(catchAsync(restaurants.displayRestaurant))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateRestaurant, catchAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurants.deleteRestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurants.editRestaurant))



module.exports = router;