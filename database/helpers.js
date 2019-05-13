/* eslint-disable no-console */
const { Op } = require('sequelize');
const {
  User,
  Business,
  CommunityListing,
  Review,
  Image,
} = require('./index.js');

// Add business to database
const addBusiness = businessObj => (
  Business.create(businessObj)
    .then(result => result)
    .catch(err => console.log(err))
);

// Get all businesses
const getAllBusinesses = () => (
  Business.findAll()
    .then(results => results)
    .catch(err => console.log(err))
);

const getAllBusinessesFromText = queryArray => (
  Business.findAll({
    where: {
      name: {
        [Op.like]: {
          [Op.any]: queryArray,
        },
      },
    },
  })
    .then(businessInfo => businessInfo)
    .catch(err => console.log(err))
);

const setBusinessOwner = (userId, businessId) => (
  Business.update({ idUser: userId }, { where: { id: businessId } })
);

const updateBusiness = (businessId, changes) => (
  Business.update(changes, { where: { id: businessId } })
);

const updateUser = (uid, changes) => (
  User.update(changes, { where: { uid } })
);

// Get business by id
const getBusinessById = id => (
  Business.findOne({ where: { id } })
    .then(business => business)
    .catch(err => console.log(err))
);

// get business by user id
const getBusinessByUser = userId => (
  Business.findOne({ where: { idUser: userId } })
    .then(result => result)
    .catch(err => console.log(err))
);

// Add user to database
const addUser = userObj => (
  User.create(userObj)
    .then(result => result)
    .catch(err => console.log(err))
);

// Get user by firebase id
const getUserById = id => (
  User.findOne({ where: { firebaseId: id } })
    .then(user => user)
    .catch(err => console.log(err))
);

const getUserByUserId = id => (
  User.findOne({ where: { id } })
    .then(user => user)
    .catch(err => console.log(err))
);

const getBusinessByFirebaseId = uid => (
  getUserById(uid)
    .then(result => getBusinessByUser(result.id))
);

// add review
const addReview = reviewObj => (
  Review.create(reviewObj)
    .then(result => result)
    .catch(err => console.log(err))
);

// get all the reviews of a certain business by that businesses id
const getReviewsByBusiness = businessId => (
  Review.findAll({ where: { idBusiness: businessId } })
    .then(result => result)
    .catch(err => console.log(err))
);

// get featured image
const getFeaturedImage = imageId => (
  Image.findOne({ where: { id: imageId } })
    .then(result => result)
    .catch(err => console.log(err))
);

// get all images for a business
const getAllImagesByBusiness = businessId => (
  Image.findAll({ where: { inBusiness: businessId } })
    .then(result => result)
    .catch(err => console.log(err))
);

// adds community listing to communityListings table.
// takes in a userId
// takes in a title for listing,
// a body of text,
// an imageURL, (either a default if none selected, or user input url/uploaded image)
// date of listing expiration is going to be the day after the event is supposed to take place

const addCommunityListing = (communityListingInfo, defaultImageUrl = 'https://makitweb.com/demo/broken_image/images/noimage.png') => {
  const communityListing = Object.create(communityListingInfo);
  communityListing.imageUrl = defaultImageUrl;
  return CommunityListing.create(communityListing);
};

// takes in the id of a user who posted the listing, and the title of the listing
const removeCommunityListing = (idUser, id) => (
  CommunityListing.destroy({ where: { idUser, id } })
    .then(result => console.log(result, 'was removed from database'))
    .catch(err => console.log('error line 176 helpers.js database: ', err))
);

// returns all community listings
const getAllCommunityListings = () => (
  CommunityListing.findAll()
    .then(result => result)
    .catch(err => console.log('error line 183 db helers:', err))
);

// queries community listings by title, maybe should also query based on body text??
const searchForCommunityListings = communityListingsQuery => (
  CommunityListing.findAll({
    where: {
      title: {
        [Op.like]: {
          [Op.any]: communityListingsQuery,
        },
      },
    },
  })
    .then(result => result)
    .catch(err => console.log('error line 198 db helpers:', err))
);


module.exports = {
  addBusiness,
  getBusinessById,
  getAllBusinesses,
  getBusinessByUser,
  addUser,
  getUserById,
  getUserByUserId,
  addReview,
  getReviewsByBusiness,
  getFeaturedImage,
  getAllImagesByBusiness,
  getAllBusinessesFromText,
  addCommunityListing,
  removeCommunityListing,
  getAllCommunityListings,
  searchForCommunityListings,
  getBusinessByFirebaseId,
  setBusinessOwner,
  updateUser,
  updateBusiness,
};
