const router = require('express').Router();
const { db } = require('../../database/index');
const { getAllBusinessesFromText, getAllBusinesses } = require('../../database/helpers');
require('dotenv').config();
// mock data
const { businesses } = require('../../database/mock-business-data');
const axios = require('axios');


// gets all businesses
router.get('/', (req, res) => {
  console.log('Grabbing all businesses');
  getAllBusinesses()
  .then((results) => {
    res.send(results);
  })
  /****************TODO****************
   * get all businesses from database
  */
  //res.send(businesses);
});


// gets business at specified id
router.get('/:id', (req, res) => {
  const id = req.params.id - 1;

  /****************TODO****************
   * get business by id from database
   */
  if(businesses[id]){
    console.log(`Grabbing business at id: ${id}`)
    res.send(businesses[id]);
  } else {
    res.sendStatus(404);
  }
});


// adds business
router.post('/', (req, res) => {
  const business = req.body;
  console.log(`added business: ${business.name} to db`);

  /****************TODO****************
   * add business to database
   */
  res.send(`added business: ${business.name} to db`)
});


// update business at specific id
router.patch('/:id', (req, res) => {
  const id = req.params.id;

  /****************TODO****************
   * update business at id in database
   */
  res.send('updated business')
})

//verifies a business by checking if image data name matches any buisness name in the table
router.post('/isVerfied', (req, res) => {
  axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_IMAGE_VERIFY_KEY}`, {
    "requests":[
      {
        "image":{
          "content": req.body.img
        },
        "features":[
          {
            "type":'DOCUMENT_TEXT_DETECTION',
            "maxResults":5
          }
        ]
      }
    ]
  }).then(result =>{
    // array of pieces of text that have been captured in picture
    var readText = result.data.responses[0].textAnnotations[0].description.replace(/\n/g, ' ').split(' ');
    console.log(readText);
    let x = result.data.responses[0].textAnnotations[0].description;
    return getAllBusinessesFromText(x)
    .then((businesses)=>{
      console.log('businesses line 85 businesses.js: ', businesses);
      return businesses;
      // current verification status
      // send back list of verified businesses 'this is a list of verified businesses,
      // are any of these the businesses you were looking for?'
    //   businesses.map((business)=>{
    //     return business.legalBusinessName.toUpperCase().split(' ');
    //   })
    //   .filter((businessesToBeComparedToReadText)=>{
    //     for(let i = 0; i < readText.length; i++){
    //       return businessesToBeComparedToReadText.includes(readText[i]);
    //     }
    //   }).length > 0 ? verificationStatus = true : null;
    //   let obj = { verificationStatus: verificationStatus, text: readText };
    //   return obj;
    // })

  })
  .then(verificationStatus => {
    console.log(verificationStatus)
    res.send(verificationStatus);
  })
  .catch(error=>{
    res.send('failure to verify, or text was misinterpreted, line 102 businesses.js server')
  })
});
});


module.exports = router;
