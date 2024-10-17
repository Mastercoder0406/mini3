
const Villa = require('../models/villa')
const { cloudinary } = require('../cloudinary')

//for map
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


//show route controls 
module.exports.index = async (req, res) => {
    const villas = await Villa.find({});
    res.render('villaslist', { villas })

}


// new farm control and create campground
module.exports.renderform = (req, res) => {
    res.render('new');
}
module.exports.createVilla = async (req, res, next) => {
    //taking data of the location 
    const geoData = await maptilerClient.geocoding.forward(req.body.villa.location, { limit: 1 });
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data ', 404)
    const villa = new Villa(req.body.villa);
    //console.log(geoData)
    villa.geometry = geoData.features[0].geometry;// creating geometry 
    villa.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    villa.author = req.user._id;
    //console.log(villa);
    await villa.save();

    //adding flash response
    req.flash('success', "Succesfully added the Villa")
    res.redirect(`/villas/${villa._id}`);


}

//show villa  controls
module.exports.showVilla = async (req, res) => {
    const villa = await Villa.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(villa)

    /**.populate({ path: 'reviews', populate: { path: 'author' } })

populate is a Mongoose method that allows us to retrieve associated documents from other collections.
 */

    //error if no campground
    if (!villa) {
        req.flash('error', 'Villa not found')
        return res.redirect('/villas')
    }

    res.render('show', { villa })
}




//edit form controls 
module.exports.rendereditForm = async (req, res) => {
    const { id } = req.params
    const villa = await Villa.findById(id)
    if (!villa) {
        req.flash('error', 'Villa not found')
        return res.redirect('/villas')
    }
    // if (!campground.author.equals(req.user._id)) {
    //     req.flash('error', 'No permission for that')
    //     return res.redirect(`/campgrounds/${id}`)
    // }
    res.render('edit', { villa })
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    // const campground = await Campground.findById(id)
    // if (!campground.author.equals(req.user._id)) {
    //     req.flash('error', 'No permission for that')
    //     return res.redirect(`/campgrounds/${id}`)
    // }
    const villa = await Villa.findByIdAndUpdate(id, { ...req.body.villa });//(... is the sprread operator)
    //map data
    const geoData = await maptilerClient.geocoding.forward(req.body.villa.location, { limit: 1 });
    villa.geometry = geoData.features[0].geometry;

    imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    villa.images.push(...imgs);
    await villa.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await villa.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfuly updated the campground')
    res.redirect(`/villas/${villa._id}`)
}



// Delete villa
module.exports.deleteVilla = async (req, res) => {
    const { id } = req.params;
    await Villa.findByIdAndDelete(id);
    req.flash('success', 'Villa has been deleted')
    res.redirect('/villas');
}