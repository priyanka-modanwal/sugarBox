const jwt = require('jsonwebtoken');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

async function authorize(req, res, next){
    try {
      const token = req.headers.authorization;
      console.log("inside authorizweeeeeeeeeeee",token)
      if(token) {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        console.log("inside authorizweeeeeeeeeeee111111111111",decoded)
        const user = await db.User.findById(req.user.id);
        if(user){
            next();

        }else{
            return res.status(401).json({
                message: 'different user'
              });

        }
        
        
      } else {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
  }