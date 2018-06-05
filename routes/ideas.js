const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
/* Curly braces to only import some functions */
const { ensureAuthenticated } = require('../helpers/auth');

/* Load Idea Model */
require('../models/Idea');
const Idea = mongoose.model('ideas');


/* Idea index page */
router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({ user: req.user.id }) // Searching for the users ideas
		.sort({ date: 'desc' })
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			});
		});
});

/* Add Idea Form */
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			if (idea.user != req.user.id) {
				req.flash('error_msg', 'Not Authorized')
				res.redirect('/ideas');
			} else {
				res.render('ideas/edit', {
					idea: idea
				});
			}
		});
});

/* Process Form and Validation */
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];

	if (!req.body.title) {
		errors.push({ text: 'Please add a title' });
	}

	if (!req.body.details) {
		errors.push({ text: 'Please add a details' });
	}

	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newIdea = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		};

		new Idea(newIdea)
			.save()
			.then(idea => {
				req.flash('success_msg', 'Video idea added');
				res.redirect('/');
			});
	}

});

/* Edit Form Process */
router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			// new values
			idea.title = req.body.title;
			idea.details = req.body.details;

			idea.save()
				.then(idea => {
					req.flash('success_msg', 'Video idea updated');
					res.redirect('/');
				})
		});
});

/* Delete idea */
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Idea.remove({ _id: req.params.id })
		.then(() => {
			req.flash('success_msg', 'Video idea removed');
			res.redirect('/');
		});
});

module.exports = router;