const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');

const port = 5000;

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('service'));
app.use(fileUpload());



const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://tom:tom1234@cluster0.iprmr.mongodb.net/agency?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("agency").collection("services");
  const bookedServiceCollection = client.db("agency").collection("book");
  const reviewsCollection = client.db("agency").collection("review");
  const adminsCollection = client.db("agency").collection("admin");

  // Booking a service
  // app.post("/bookService",(req,res) =>{
  //     const bookedService = req.body
  //     console.log(bookedService)

  //     bookedServiceCollection.insertOne(bookedService)
  //     .then(result =>{
  //       res.send(result)
  //     })
  // })

  // Add Admin
  app.post("/addAdmin",(req,res) =>{
        const adminEmail = req.body
        console.log(adminEmail)
  
       adminsCollection.insertOne(adminEmail)
        .then(result =>{
          res.send(result)
        })
    })
    app.post('/isAdmin', (req, res) => {
      const email = req.body.email;
      adminsCollection.find({ email: email })
          .toArray((err, doctors) => {
              res.send(doctors.length > 0);
          })
  })
  
  // Services displaying on Home Page
   app.get('/homeServices',(req,res) =>{
      servicesCollection.find().limit(3)
      .toArray((err,documents) =>{
        res.send(documents)
      })
   })

  // All Services
   app.get('/allServices',(req,res) =>{
    servicesCollection.find({})
    .toArray((err,documents) =>{
      res.send(documents)
    })
 })
  
//  Adding New Services
  app.post("/addService", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    servicesCollection
      .insertOne({ name, description, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });


  //  Adding Clients review
  app.post("/reviews", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.description;
    const designation = req.body.designation;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    reviewsCollection
      .insertOne({ name,designation, description, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });
  // Displaying testimonials
  app.get('/displayReview',(req,res) =>{
    reviewsCollection.find({})
    .toArray((err,documents) =>{
      res.send(documents)
    })
 })
  
  // client.close();
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)




  // app.post('/addService',(req,res) =>{
  //    const file = req.files.file;

  //    const title = req.body.title;
  //   //  const description = req.body.description;
  //   const filePath = (`${__dirname}/services/${file.name}`)
  //    console.log(file,title)
  //    file.mv(filePath,er =>{
  //      if(er){
  //        console.log(er)
  //        return res.status(500).send({msg:'Failed to Upload'})
  //      }
  //     res.send({name:file.name,path:`${file.name}`})
  //    })
  //    const newImg = fs.readFileSync(filePath);
  //     const encImg = newImg.toString('base64');

  //    var image = {
  //       contentType: req.files.file.mimetype,
  //       size: req.files.file.size,
  //       img: Buffer(encImg,'base64')
  //    };
  
  //    serviceCollection.insertOne({file})
  //    .then(result =>{
  //     fs.remove(filePath,error =>{
  //       if(error){console.log(error)}
  //       res.send(result)
  //     })
  //    })
  // })