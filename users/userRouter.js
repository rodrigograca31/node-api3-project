const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
	// do your magic!
	Users.insert(req.body)
		.then(data => {
			if (data) {
				res.status(200).json(data);
			} else {
				res.status(500).json({ message: "error" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
	// do your magic!
	Posts.insert(req.body)
		.then(result => {
			if (result) {
				res.status(200).json(result);
			} else {
				res.status(500).json({ message: "error 1" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error 2" });
		});
});

router.get("/", (req, res) => {
	// do your magic!
	Users.get()
		.then(data => {
			if (data) {
				res.status(200).json(data);
			} else {
				res.status(404).json({ message: "user not found" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

router.get("/:id", validateUserId, (req, res) => {
	// do your magic!
	res.status(200).json(req.user);
	// Users.getById(req.params.id)
	// 	.then(data => {
	// 		if (data) {
	// 			res.status(200).json(data);
	// 		} else {
	// 			res.status(404).json({ message: "user not found" });
	// 		}
	// 	})
	// 	.catch(err => {
	// 		res.status(500).json({ message: "error" });
	// 	});
});

router.get("/:id/posts", validateUserId, (req, res) => {
	// do your magic!

	Users.getUserPosts(req.user.id)
		.then(result => {
			if (result) {
				res.status(200).json(result);
			} else {
				res.status(200).json({});
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

router.delete("/:id", validateUserId, (req, res) => {
	// do your magic!
});

router.put("/:id", validateUserId, (req, res) => {
	// do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
	// do your magic!
	console.log("validate user id");
	console.log(typeof req.params.id);

	if (new RegExp(/^\d+$/).test(req.params.id) !== true) {
		res.status(500).json({ message: "Invalid user ID" });
		return true;
	}

	Users.getById(req.params.id)
		.then(data => {
			if (data) {
				req.user = data;
				next();
			} else {
				res.status(404).json({ message: "user not found" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error getting user" });
		});
}

function validateUser(req, res, next) {
	// do your magic!
	if (!req.body) {
		res.status(400).json({ message: "missing user data" });
		return true;
	}
	if (!req.body.name) {
		res.status(400).json({ message: "missing required name field" });
		return true;
	}
	next();
}

function validatePost(req, res, next) {
	// do your magic!
	if (!req.body) {
		res.status(400).json({ message: "missing post data" });
		return true;
	}
	if (!req.body.text) {
		res.status(400).json({ message: "missing required text field" });
		return true;
	}
	req.body.user_id = req.params.id;
	next();
}

module.exports = router;
