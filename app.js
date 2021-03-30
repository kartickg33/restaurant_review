const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require("connect-mongo");

if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}


const uri = process.env.MONGODB_URI;

const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');

mongoose.connect(uri,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected")
});

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
    replaceWith:'_'
}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoDBStore.create({
    mongoUrl: uri,
    secret,
    touchAfter: 24*60*60
});

store.on("error",function(e){
    console.log("Session Store Error !",e)
});

const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires: Date.now() + 1000*60*15,
        maxAge:1000*60*15
    } 
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    //console.log(req.session);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next(); 
})

// app.get('/fakeuser',async(req,res)=>{
//     const user = new User({email:'coltttt@gmail.com',username:'coltttt'});
//     const newUser = await User.register(user,'chicken')
//     res.send(newUser);
// })

app.use('/',userRoutes);
app.use('/restaurants',restaurantRoutes);
app.use('/restaurants/:id/reviews',reviewRoutes);

app.get('/',(req,res)=>{
    res.render('home.ejs')
});

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('error',{err});   
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Serving on port ${port}`)
})