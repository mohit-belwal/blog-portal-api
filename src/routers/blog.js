const express = require('express')
const Blog = require('../models/blog')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()


// Create a new blog 
router.post('/blogs', auth, async (req, res)=>{
    const blog = new Blog({
        ...req.body,
        user: req.user._id
    })

    try {
        await blog.save()
        res.status(201).send(blog)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Update an existing blog 
router.patch('/blogs/:id', auth, async (req, res)=>{
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'content']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }

    try {
        const blog = await Blog.findOne({_id, user: req.user._id})
        
        if(!blog){
            return res.status(404).send()
        }
        updates.forEach((update) => blog[update] = req.body[update])
        await blog.save()

        res.send(blog)
    } catch(e){
        res.status(400).send(e)
    }
})

// Delete an existing blog 
router.delete('/blogs/:id', auth, async (req, res)=>{
    const _id = req.params.id

    try {
        const blog = await Blog.findOneAndDelete({_id, user: req.user._id})

        if(!blog){
            return res.status(404).send()
        }
        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

// Get all blogs of a user 
// GET /blogs/?limit=2&page=2
router.get('/blogs', auth, async (req, res)=>{
    const {limit, page} = req.query

    try {
        const blogs = await Blog.find({user: req.user})
        .limit(limit * 1)
        .skip((page - 1) * limit).sort('-createdAt')
        .exec();

        // get total documents in the Blog collection 
        // const count = await Blog.estimatedDocumentCount();
        const count = Object.keys(blogs).length;
        console.log(count)
        // return response with blogs, total pages, and current page
        res.send({
        blogs,
        totalPages: Math.ceil(count / limit),
        currentPage: page
        });
    } catch (e) {
        res.status(500).send(e)
    }
})

// Get a single blog of user by its id 
router.get('/blogs/:id', auth, async (req, res)=>{
    const _id = req.params.id 

    try {
        const blog = await Blog.findOne({_id, user: req.user._id})
        if(!blog){
            return res.status(404).send()
        }
        res.send(blog)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Get all blogs present on the site 
// GET /blogs/all/?limit=2&page=2
router.get('/blogsAll', auth, async (req, res)=>{
    const {limit, page} = req.query

    try{
        const blogs = await Blog.find()
        .limit(limit * 1)
        .skip((page - 1) * limit).sort('-createdAt')
        .exec();

        // get total documents in the Blog collection 
        const count = await Blog.countDocuments();
        
        // return response with blogs, total pages, and current page
        res.send({
        blogs,
        totalPages: Math.ceil(count / limit),
        currentPage: page
        });
    } catch(e){
        res.status(500).send(e)
    }
})

// Get a single blog by its id present on the site 
router.get('/blogsAll/:id', auth, async (req, res)=>{
    const _id = req.params.id 
    try {
        const blog = await Blog.findOne({_id})
        if(!blog){
            return res.status(404).send()
        }
        res.send(blog)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Like/Dislike a blog 
router.patch('/blogsAll/:id/like', auth, async (req, res)=>{
    const blog = await Blog.findById(req.params.id)

    try { 
        if(!blog.likes.includes(req.user._id)){
            blog.likes = blog.likes.concat(req.user._id)
            await blog.save()
            res.send(blog)
        } else{
            blog.likes.splice(blog.likes.indexOf(req.user._id),1)
            await blog.save()
            res.send(blog)
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


module.exports = router
