const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-shlomo:Test123@cluster0.mdnht.mongodb.net/blogDB?retryWrites=true&w=majority", { useUnifiedTopology: true, useUnifiedTopology: true, useNewUrlParser: true })

const postSchema = {
    title: String,
    body: String,
    timestemp: String,
    slug: String
    //owner: String
}

const Post = mongoose.model('post', postSchema)

exports.newPost = async (title, body) => {
    const anyPost = await Post.findOne({ title: title })
    console.log("anyPost", anyPost);
    let post = null
    if (anyPost) {
        post = new Post(
            {
                title: title,
                body: body,
                timestemp: Date().toString(),
                slug: `${title}${Math.floor(Math.random() * 9999999999)}`
            })
    } else {
        post = new Post(
            {
                title: title,
                body: body,
                timestemp: Date().toString(),
                slug: title
            })
    }
    console.log("post", post);
    const savedPost = await post.save();
    return savedPost === post;
}

exports.getPosts = async () => {
    const docs = (await Post.find({}).exec()).sort((b, a) => Date.parse(a.timestemp) - Date.parse(b.timestemp));
    return docs;
}
exports.getPostsByName = async (name) => {
    const docs = await Post.findOne({ title: name }).exec();
    return docs;
}

exports.getPostsBySlug = async (slug) => {
    const docs = await Post.findOne({ slug: slug }).exec();
    return docs;
}