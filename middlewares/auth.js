const jwt = require('jsonwebtoken');
const User = require('../Modals/signForm');
const auth = async (req,res,next)=>{
    
        //const token = req.headers.authorization.split(" ")[1];
        
        try{
           
            const token = req.header('Authorization').replace('Bearer ', '');
            console.log("ani");
            console.log(token);
            
            const decoded = jwt.verify(token,'thisismynewcourse');
            const user = await User.findOne({email: decoded.email, 'tokens.token': token});
            if(!user){
                throw new Error();
            }
            req.token = token;
            req.user = user;
            next();
            console.log("aniket")
            //console.log(decode);
            
        }catch(e){
            res.status(401).json({
                message:'invalid',
            })
        }
       
    
    
   // const token = req.header('Authorization').replace('Bearer ','');
   
}

module.exports = auth;