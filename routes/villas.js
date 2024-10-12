const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, isReviewAuthor, validateVilla, validateReview } = require('../middleware');
const Villa = require('../models/villa');
const Review = require('../models/reviews');
const ExpressError = require('../utils/expresserror')

//importing the controllers
const villas = require('../controllers/villas')

//importing multer to upload files 
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// Chaining of the routes using .get.post for the same url route
router.route('/')
  .get(catchAsync(villas.index)) // grouping same route using dot method
  .post(isLoggedIn, upload.array('image'), validateVilla, catchAsync(villas.createVilla))






router.get('/new', isLoggedIn, villas.renderform)


router.route('/:id')
  .get(catchAsync(villas.showVilla))
  .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(villas.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(villas.deleteVilla))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(villas.rendereditForm))

// // Listing all the villas
// router.get('/', async (req, res) => {
//   const villas = await Villa.find({});
//   res.render('villaslist', { villas });
// });

// // Creating new villa
// router.get('/new', isLoggedIn, (req, res) => {
//   res.render('new');
// });

// router.post('/', isLoggedIn, validateVilla, catchAsync(async (req, res, next) => {
//   // if (!req.body.villa) throw new ExpressError('Invalid villa data ', 404)
//   const villa = new Villa(req.body.villa);
//   villa.author = req.user._id;
//   await villa.save();
//   req.flash('success', 'Successfully made a new campground');
//   res.redirect(`/villas/${villa._id}`);
// }));

// // Get villa by id
// router.get('/:id', catchAsync(async (req, res) => {
//   const villa = await Villa.findById(req.params.id).populate({
//     path:'reviews',
//     populate:{
//       path: 'author'
//     }
//   }).populate('author');
//   console.log(villa);
//   if(!villa){
//     req.flash('error', 'Cannot find that villa!');
//     return res.redirect('/campgrounds');
//   }
//   res.render('show', { villa });
// }));

// // Edit the villa after found
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     req.flash('error', 'Invalid villa ID!');
//     return res.redirect('/campgrounds');
//   }
//   const villa = await Villa.findById(id);
//   if (!villa) {
//     req.flash('error', 'Cannot find that villa!');
//     return res.redirect('/campgrounds');
//   }
//   res.render('edit', { villa });
// }));

// router.put('/:id', isLoggedIn, isAuthor, validateVilla,  catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const villa = await Villa.findByIdAndUpdate(id, { ...req.body.villa }); // (... is the spread operator)
//   req.flash('success', 'Successfully updated Villa!');
//   res.redirect(`/villas/${villa._id}`);
// }));

// // Delete villa
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//   const { id } = req.params;
//   await Villa.findByIdAndDelete(id);
//   req.flash('success', 'Successfully deleted!');
//   res.redirect('/villas');
// }));


module.exports = router;