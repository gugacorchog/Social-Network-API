const { User, Thought } = require('../models');
const db = require('../models');

const userController = {
  //get all users
  getAllUsers(req, res) {
    console.log(``);
    console.log("client request to get all users");
    console.log(``);
    console.log("request path");
    console.log(req.path);
    User.find()
    
    .select('-__v')
    .then(dbUserData => res.json(dbUserData))
    .catch(e => { console.log(e); res.status(500).json(e) });
  },
  //get a user by id
  getUserById(req, res) {
    console.log(``);
    console.log("client request to get a user by id");
    console.log(``);
    console.log(req.params);
    User.findOne
    (
      {
        _id: req.params.id
      }
    )
    .populate(
      {
        path: 'thoughts',
        select: '-__v'
      },
    )
    .populate(
      {
        path: 'friends',
        select: '-__v'
      }
    )
    .select('-__v')
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({message: `no user found with the id of ${req.params.id}`})
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e) });
  },
  //create a user
  createUser(req, res) {
    console.log(``);
    console.log("client request to create a user");
    console.log(``);
    console.log(req.body);
    User.create(req.body)
    .then(dbUserData => res.json(dbUserData))
    .catch(e => { console.log(e); res.status(500).json(e) });
  },
  //update a user: find by id and update
  updateUser(req, res) {
    console.log(``);
    console.log("client request to update a user");
    console.log(``);
    console.log(req.params);
    console.log(req.body);
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({message: `no user found with the id of ${req.params.id}`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e) });
  },
  //delete a user
  deleteUser: async (req, res) => {
    console.log(``);
    console.log("client request to delete a user");
    console.log(``);
    console.log(req.body)
    console.log(req.params);
    try {
      // find and delete all those thoughts that match with the username in the req.body 
      const deletedThoughts = await Thought.deleteMany
      (
        { username: req.body.username }
      );
      console.log(deletedThoughts);
      //find all users that have this user on deck for deletion in their friends list
      // and update the queried users' friendslists to not include the deleted user's id
      const deletedFriend = await User.updateMany
      (
        //get all users
        {},
        //pull friend Id from all users that have that friend id in their friends array
        {
          $pull: {
            friends: req.params.id
          }
        }
      );
      console.log(deletedFriend);
      //delete the user
      const deletedUser = await User.findOneAndDelete
      (
        { _id: req.params.id }
      );
      console.log(deletedUser);
      if (!deletedUser) {
        res.status(404).json({message: `no user found with the id of ${req.params.id}`});
      }
      res.status(200).json({message: `the user ${req.body.username} and their thoughts have been deleted.`});
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  //add friend method
  //like an update method
  addFriend(req, res) {
    console.log(``);
    console.log("client request to add a friend");
    console.log(``);
    console.log(req.params);
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      { $push: { friends: req.params.friendId } },//parameter containing friendId
      { new: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: `no user found with the id of ${req.params.id}`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },

  //delete friend method
  deleteFriend(req, res) {
    console.log(``);
    console.log("client request to add a friend");
    console.log(``);
    console.log(req.params);
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: `no user found with the id of ${req.params.id}`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  }
};

module.exports = userController;