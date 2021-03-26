const mongoose = require('mongoose')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')
const Restaurant = require('../models/restaurant')
require("dotenv").config();
const uri = 'mongodb://localhost:27017/restaurant_review' ;

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
    for(let i = 0; i < 100; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*200)+100;
        const restaurant = new Restaurant({
            author:'6058d81e55fb0275bcce6176',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`Sample Restaurant ${count++}`,
            images:[
                {
                  
                  url: 'https://res.cloudinary.com/diyscwbit/image/upload/v1616073543/Camping-Grounds/behhnatqgsz8ipxuagsw.jpg',
                  filename: 'Camping-Grounds/behhnatqgsz8ipxuagsw'
                },
                {
                
                    url: 'https://res.cloudinary.com/diyscwbit/image/upload/v1616073542/Camping-Grounds/kt6dn8qzkrjofaklmfdg.jpg',
                    filename: 'Camping-Grounds/kt6dn8qzkrjofaklmfdg'
                  }
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