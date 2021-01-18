const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

module.exports = {
    createUser,
    authenticate,
    getAll,
    getById,
    deleteUser
};


async function createUser(params) {
    console.log("params",params,);

    let result = db.User.create(params)
    return result
}

async function authenticate({ email, password }) {
    const user = await db.User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'email or password is incorrect';
    }
    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);
    // return basic details and tokens
    return { 
        user,
        jwtToken
    };
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    console.log("tkennnnn====>",jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' }));
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
}
//get all with pagination
async function getAll(page) {
    let docPerPage = 10;
     page = page-1;
    const users = await db.User.find().limit(docPerPage).skip(docPerPage * page);
    return users;
}

async function getById(id) {
    const user = await getUser(id);
    return user;

}

async function getUser(id) {
    if (!db.isValidId(id)) throw 'User not found';
    const user = await db.User.findById(id);
    if (!user) throw 'User not found';
    return user;
}

async function deleteUser(id){
    const user = await db.User.deleteOne({"_id":id});
    console.log("delete user",user);
    return user;


}
