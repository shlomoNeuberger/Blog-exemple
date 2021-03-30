const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const _ = require("lodash")
const postDB = require(__dirname + '/postDB');

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


app.get("/", async (req, res) => {
    const posts = await postDB.getPosts()
    res.render("home", { posts: posts })
})

app.get("/post/:postTitle", async (req, res) => {
    const postTitle = _.startCase(req.params.postTitle)
    const posts = await postDB.getPosts()
    const result = posts.filter(post => _.startCase(post.title) === postTitle)
    if (result.length === 1) {
        res.render("post", { post: result[0] })
    } else {
        res.redirect("/")
    }
})
app.get("/about", (req, res) => {
    res.render("about")
})
app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/compose", (req, res) => {
    res.render("compose", { error: "" })
})

app.post("/compose", (req, res) => {
    const post = {
        title: req.body.postTitle,
        body: req.body.postBody,
    }
    if (post.title !== '' && post.body !== '') {
        const success = postDB.newPost(_.startCase(post.title), post.body)
        if (success) {
            res.redirect("/")
        } else {
            res.render("compose", { error: "" })
        }
    }
})

app.listen(3000, () => {
    console.log("Server satrted at port 3000");
})

