const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')
const userService = require('./user.service');
const bcrypt = require('bcryptjs')

// routes
router.post('/createUser',createUser)
router.post('/authenticate', authenticate);
router.get('/', authorize, getAll);//pagination 10 documents per page
router.get('/:id', authorize, getById);
router.delete('/deleteUser/:id',authorize,deleteUser);



module.exports = router;


function authenticate(req, res, next) {
    const { email, password } = req.body;
    userService.authenticate({ email, password })
        .then(({ ...user }) => {
            console.log("user====>",user);
            res.json(user);
        })
        .catch(next);
}


async function createUser(req,res,next) {
    console.log("data==>",req.body)
    let data = {
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
    }
    let response =  await userService.createUser(data)
    res.json(response)
    
}

function getAll(req, res, next) {
    let page = req.params.page;
    userService.getAll(page)
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

async function deleteUser(req,res,next){
    console.log("delete id",req.params.id);
    let userId=req.params.id;
    let user = await userService.getById(userId);
    console.log("useruseruseruser",user);
    if(user){
        let deleted = await userService.deleteUser(userId);
        console.log("useruseruseruser111111111",deleted);
        res.json(deleted);
    }else{
        res.json("user not exist");
    }

    
}