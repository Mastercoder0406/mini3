
// before running the project for the first time this inde2.js should be run to create and populate the database
//index2.js is poupulating is the database so here the data should be manually enterd 



const { default: mongoose } = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedhelper');//destructuring assingment importinmg two seperate variable in single line of code 
const villas = require('../models/villa');

//creating db
mongoose.connect('mongodb://127.0.0.1:27017/villas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// always use connectio ip 127.0.0.1.27017

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



// randomly selecting the description 
// this sample takes the array as input and give random elemtn from array
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await villas.deleteMany({}); // this line deletes the previos data 
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 10);
        // adding new data or row in the table 
        const camp = new villas({
            author: '67062ac1578ab1b75d30b267',
            //670ac78bdcc486d3cca4e28f
            author: '670ac78bdcc486d3cca4e28f',
            //more things describing the villas can be added  can be added
            // this below codes populates the database
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            //title seeding
            title: `${sample(descriptors)} ${sample(places)}`,

            //adding the description
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',

            //geometry 
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }, 

            // randomly selecting the image from the website it needs to be modified based on input from the user 
            images: [
                {
                    //https://res.cloudinary.com/djimghjqo/image/upload/v1728662799/Villaverse/e9mqrmoznzk0xa3fi4lo.png
                    url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Frandom%2F&psig=AOvVaw0DW6fg_NKZGTLzs_Z6NYkO&ust=1728845453046000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLjzxbTBiYkDFQAAAAAdAAAAABAE',
                    filename: 'YelpCamp/e9mqrmoznzk0xa3fi4lo',
                }

            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
