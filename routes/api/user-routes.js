const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require('../../controllers/user-controller.js');

//user getAll and post routes
// /api/users
router.route('/').get(getAllUsers).post(createUser);

//user get one, update one, and delete one
// /api/users/<userId>
router
.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

//user adds a friend
// /api/users/<userId>/friends/<friendId>
router.route('/:id/friends/:friendId')
.post(addFriend);

//user deletes a friend
// /api/users/<userId>/friends/<friendId>
router.route('/:id/friends/:friendId')
.delete(deleteFriend);

module.exports = router;