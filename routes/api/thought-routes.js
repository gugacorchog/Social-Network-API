const router = require('express').Router();

const {
  addThought,
  deleteThought,
  addReaction,
  deleteReaction,
  getAllThoughts,
  getThoughtById,
  updateThought,
  updateReaction
} = require('../../controllers/thought-controller.js');

//GET all thoughts
//POST a thought include userId in the body
// /api/thoughts
router.route('/')
.get(getAllThoughts)
.post(addThought);

//GET a thought by thought id
//DELETE  a thought by thought id
// /api/thoughts/:id
router.route('/:id')
.get(getThoughtById)
.put(updateThought)

router.route('/:id/users/:userId')
.delete(deleteThought);


//add a reaction
//update a thought
// /api/thoughts/:id/reactions/
router.route('/:id/reactions/')
.post(addReaction);

//delete a reaction
//update a thought
// /api/thoughts/:id/reactions/<reactionId>
router.route('/:id/reactions/:reactionId')
.put(updateReaction)
.delete(deleteReaction);

module.exports = router;