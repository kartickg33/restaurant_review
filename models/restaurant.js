const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
        url: String,
        filename:String
});

ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload','/upload/w_200')
});// this basically creates a virtual thumbnail(200 px) for the images being displayed in the edit page to make the page look clean....through cloudinary
//the images will not be stored in the db for edit page, they will be shown virtually through the url

const RestaurantSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry:{
        type: {
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    active: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts);

// CampgroundSchema.virtual('properties.popUpMarkup').get(function (){
//     return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
// })

RestaurantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);
