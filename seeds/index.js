const mongoose = require('mongoose')
const cities = require('./cities')
const Restaurant = require('../models/restaurant')
require("dotenv").config();
const uri = process.env.MONGODB_URI ;

mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async ()=>{
    await Restaurant.deleteMany({});
    var count = 1;
    for(let i = 0; i < 90; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*200)+100;
        const restaurant = new Restaurant({
            author:'6060397d50513e70a89c2c76',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`Sample Restaurant ${count++}`,
            images:[
                    {
                        url: 'https://res.cloudinary.com/diyscwbit/image/upload/v1616834835/restaurant_review/display_img_e0nphb.jpg',
                        filename:'restaurant_review/display_img_e0nphb'
                    }
                // {
                  
                //   url: 'https://res.cloudinary.com/diyscwbit/image/upload/v1616791383/restaurant_review/pj7qbt5tdbcfcbta4yol_c7mwgc.jpg',
                //   filename: 'restaurant_review/pj7qbt5tdbcfcbta4yol_c7mwgc'
                // },
                // {
                
                //     url: 'https://res.cloudinary.com/diyscwbit/image/upload/v1616791491/restaurant_review/photo-1554118811-1e0d58224f24_anbfmk.jpg',
                //     filename: 'restaurant_review/photo-1554118811-1e0d58224f24_anbfmk'
                //   }
              ],
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta atque earum blanditiis, similique odit nobis magni? Quia adipisci voluptatum, eum incidunt quae consequuntur. Quo tenetur totam beatae laborum aliquid. Illum.',
            price,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            active:"10:00 AM - 12:30 AM"
        })
        await restaurant.save();
    }
    //const c = new Restaurant({title:'purple field'});
    //await c.save();
}


seedDB().then(()=>{
    mongoose.connection.close();
});