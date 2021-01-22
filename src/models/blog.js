const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title:{
        type: String, 
        required: true, 
        trim: true
    }, content: {
        type: String
    }, likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }], user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true}
)

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog