const express = require("express");

const router = express.Router();
const Posts = require("../posts/postDb");

router.get("/", (req, res) => {
	// do your magic!
	Posts.get()
		.then(data => {
			if (data) {
				res.status(200).json(data);
			} else {
				res.status(404).json({ message: "post not found" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

router.get("/:id", validatePostId, (req, res) => {
	// do your magic!
	res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
	// do your magic!
	Posts.remove(req.params.id)
		.then(result => {
			if (result) {
				res.status(200).json(req.post);
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

router.put("/:id", validatePostId, validateBody, (req, res) => {
	// do your magic!
	Posts.update(req.params.id, req.body)
		.then(result => {
			if (result) {
				res.status(200).json(req.body);
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error" });
		});
});

// custom middleware

function validatePostId(req, res, next) {
	// do your magic!

	if (new RegExp(/^\d+$/).test(req.params.id) !== true) {
		res.status(500).json({ message: "Invalid user ID" });
		return true;
	}

	Posts.getById(req.params.id)
		.then(data => {
			if (data) {
				req.post = data;
				next();
			} else {
				res.status(404).json({ message: "post not found" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "error getting post" });
		});
}
function validateBody(req, res, next) {
	if (!req.body) {
		res.status(400).json({ message: "missing data" });
		return true;
	}
	if (!req.body.text) {
		res.status(400).json({ message: "missing required field" });
		return true;
	}
	next();
}

module.exports = router;
