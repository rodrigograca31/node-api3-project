const express = require("express");
const server = express();
const userRoutes = require("./users/userRouter");
const postsRoutes = require("./posts/postRouter");

server.use(express.json());

server.listen(4000, () => {
	console.log("\n* Server Running on http://localhost:4000 *\n");
});

//custom middleware
function logger(req, res, next) {
	console.log(`${req.method} ${req.url} ${new Date().getTime()}`);
	next();
}
// server.use("*", logger);
server.use(logger);
server.use("/users", userRoutes);
server.use("/posts", postsRoutes);

server.get("/", (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
