const { ObjectId } = require("mongodb");
let express = require("express");
let router = express.Router();
let app = express();
var data = require("../json/heroes.json");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const User = require('../Modals/signForm');


const cors = require("cors");
router.use(cors());

const joi = require('joi');
const schema = joi.object().keys({
  password: joi.string().regex(/^[a-zA-Z0-9]{8,30}/),
  confirmPassword: joi.string().regex(/^[a-zA-Z0-9]{8,30}/)
});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require('../middlewares/auth');

//  INSERTION PART by using Call Back_______________________________________

// router.post("/postHero",(req,res)=>{

//      MongoClient.connect(url, function(err, db) {
//         if (err) console.log("Error in connetion");
//         else {
//           var dbase = db.db("SuperHeroes");
//           dbase.collection("HeroDetails").insertMany(data, function(err, res) {
//             if (err) console.log("Error in insert");
//             else
//               console.log("in insert");
//               console.log("Number of documents inserted: " + res.insertedCount);
//           });
//         }
//       });

// })

//INSERTION BY USING PROMISES__________________________________________________
// router.post("/postHero", (req, res) => {

//   MongoClient.connect(url, function (err, db) {
//     var dbase = db.db("SuperHeroes");
//     dbase
//       .collection("HeroDetails")
//       .insertMany(req.body.heroes)
//       .then(resp => {
//         res.send({ type: "POST" });
//         console.log("inserted");
//       })
//       .catch(function (err) {
//         console.log("errror");
//       });

//   });

// });

// INSERTION USING ASYNC AWAIT_______________________________________________
router.post("/postHero",auth,  async (req, res) => {
  try {
    MongoClient.connect(url, async (err, db) => {
      try {
        var dbase = db.db("SuperHeroes");
        await dbase
          .collection("HeroDetails")
          .insertOne(req.body, async (error, resp) => {
            await res.send(req.body);
            console.log("in insert");
          });
      } catch {
        console.log("eee");
      }
    });
  } catch (err) {
    console.log("error in inserting");
  }
});

//  READ ALL BY USING ASYNC AWAIT______________________________

router.get("/getHero", async (req, res) => {
  try {
    MongoClient.connect(url, async (err, db) => {
      try {
        var dbase = db.db("SuperHeroes");
        await dbase
          .collection("HeroDetails")
          .find({})
          .toArray(async (error, resp) => {
            await res.send(resp);
            //console.table(resp);
            //console.log("in read");
          });
      } catch {
        console.log("error in reading");
      }
    });
  } catch (err) {
    console.log("error in reading");
  }
});

// FIND ALL PART BY USING CALL BACK______________________________________________________

//  router.get("/getHero",(req,res)=>{

//     MongoClient.connect(url, function(err, db) {
//         if (err) console.log("Error in connetion");
//         else {
//             var dbase = db.db("SuperHeroes");
//         dbase.collection("HeroDetails").find({}).toArray(function(err, res) {

//             if (err) console.log("Error in find");
//             else{
//             console.log("in find");
//             console.table(res);
//             }

//         });
//         }
//     });

// })

// FIND ALL BY USING PROMISES_______________________________________________________

// router.get("/getHero",(req,res)=>{

//   MongoClient.connect(url, function (err, db) {
//     var dbase = db.db("SuperHeroes");
//     dbase
//       .collection("HeroDetails")
//       .find({})
//       .toArray()
//       .then((resp) => {
//         // res.send({ type: "GET" });
//         res.send(resp);
//         console.log("read");
//         console.table(resp);
//       })
//       .catch(function (err) {
//         console.log("errror");
//       });

//   });

// });

// FIND ONE PART--------------------------------------not done
// router.get("/getHero",(req,res)=>{

// MongoClient.connect(url, function(err, db) {
//     if (err) console.log("Error in connetion");
//     else {
//         var dbase = db.db("SuperHeroes");
//     dbase.collection("HeroDetails").findOne({canFly:true}, function(err, result) {
//         if (err) console.log("Error in find");
//         else{
//         console.log("in find");
//         console.log(res);
//         }

//     });
//     }
// });

// })

// FIND ONE BY USING ASYNC AWAIT_________________________________________________

// router.get("/getHero/canFly", async (req, res) => {
//   try {
//     MongoClient.connect(url, async (err, db) => {
//       try {
//         var dbase = db.db("SuperHeroes");
//         var value1 = JSON.parse(req.headers['canfly']);
//        // console.log(value1);
//         await dbase
//           .collection("HeroDetails")
//           .find({canFly:value1}).toArray(async (error, resp) => {
//             await res.send(resp);
//             console.table(resp);
//             console.log("in read");
//           });
//       }
//       catch{
//         console.log("eee");
//       }

//     });

//   } catch (err) {
//     console.log("error in reading");
//   }

// });

// DELETE ALL -----------------------------------------

// router.delete("/deleteHero",(req,res)=>{
//    // res.send({type:'DELETE'});
//    MongoClient.connect(url, function(err, db) {
//     if (err) console.log("Error in connetion");
//     else {
//         var dbase = db.db("SuperHeroes");
//         var deleteQuery = {$where:"this.superPowers.length>=3"};
//     dbase.collection("HeroDetails").deleteMany(deleteQuery, function(err, result) {
//         if (err) console.log("Error in delete");
//         else{
//         console.log("in delete");
//         //console.log(res);
//         }

//     });
//     }
// });
// })

//  DELETE ALL USING PROMISES__________________________________________
// router.delete("/deleteHero",(req,res)=>{
// MongoClient.connect(url, function (err, db) {
//       var dbase = db.db("SuperHeroes");
//       var deleteQuery = {$where:"this.superPowers.length>=3"};
//       dbase
//         .collection("HeroDetails")
//         .deleteMany(deleteQuery)
//         .then((resp) => {
//            res.send({ type: "DELETE" });

//           console.log("deleted");

//         })
//         .catch(function (err) {
//           console.log("errror");
//         });

//     });
//   });

//    DELETE PART BY USING ASYNC AWAIT________________________________
// router.delete("/deleteHero", async (req, res) => {
//   try {
//     MongoClient.connect(url, async (err, db) => {
//       try {
//         var dbase = db.db("SuperHeroes");
//         var query1 = {$where:"this.superPowers.length>=3"};
//         await dbase
//           .collection("HeroDetails")
//           .deleteMany(query1, async (error, resp) => {
//             await res.send(req.body.heroes);
//             console.log("in delete");
//           });
//       }
//       catch{
//         console.log("eee");
//       }

//     });

//   } catch (err) {
//     console.log("error in deleting");
//   }

// });

// Update All---------------------------USING CALL BACK_______________
// router.put("/putHero", (req, res) => {
//   // res.send({type:'PUT'});
//   MongoClient.connect(url, function (err, db) {
//     if (err) console.log("Error in Update");
//     else {
//       var dbase = db.db("SuperHeroes");
//       var myquery = {
//         $and:
//           [{ fightsWon: { $gt: 10 } },
//           { superPowers: "fly" }, { superPowers: "swim" }]
//       };
//       var newquery = { $mul: { fanFollowing: 2 } };
//       dbase
//         .collection("HeroDetails")
//         .updateMany(myquery, newquery, function (err, res) {
//           if (err) console.log("Error in Update");
//           else {
//             console.log("in Update");
//             console.log(res.result.n + " document(s) Updated");
//           }
//         });
//     }
//   });
// })

//               UPDATE all            ---------             using promises___________________________________________________
// router.put("/putHero", (req, res) => {
//   MongoClient.connect(url, function (err, db) {
//     var dbase = db.db("SuperHeroes");
//     var myquery = {
//               $and:
//                 [{ fightsWon: { $gt: 10 } },

//                 { superPowers: "fly" }, { superPowers: "swim" }]
//             };
//     var newquery = { $mul: { fanFollowing: 2 } };
//     dbase
//       .collection("HeroDetails")
//       .updateMany(myquery,newquery)
//       .then((resp) => {
//          res.send({ type: "PUT" });

//         console.log("update");

//       })
//       .catch(function (err) {
//         console.log("errror");
//       });

//   });
// });

//    UPDATE all  BY USING ASYC AWAIT______________________________________________
// router.put("/putHero", async (req, res) => {
//   try {
//     MongoClient.connect(url, async (err, db) => {
//       try {
//         var dbase = db.db("SuperHeroes");
//         var query1 = {$and:
//                           [{fightsWon:{$gt:1}},
//                             {superPowers:"fly"},
//                             {superPowers:"swim"}
//                           ]};
//         var newquery1 = {$mul:{fanFollowing:3}};
//         await dbase
//           .collection("HeroDetails")
//           .updateMany(query1,newquery1, async (error, resp) => {
//             await res.send(req.body.heroes);
//             console.log("in update");
//           });
//       }
//       catch{
//         console.log("eee");
//       }

//     });

//   } catch (err) {
//     console.log("error in deleting");
//   }

// });

//  DELETE ONE BY USING PROMISES________________________________________________
router.delete("/deleteHero/:id",auth, (req, res) => {
  MongoClient.connect(url, function(err, db) {
    var dbase = db.db("SuperHeroes");
    var deleteQuery = { _id: ObjectId(req.params.id) };
    //console.log(req.params.id);
    dbase
      .collection("HeroDetails")
      .deleteOne(deleteQuery)
      .then(resp => {
        res.send({ type: "DELETE" });
        //console.log(req.params.id);
        console.log("deleted");
      })
      .catch(function(err) {
        console.log("errror");
      });
  });
});

//  DELETE BY USING ASYNC AWAIT______________________________________________________
// router.delete("/putHero/:id", async (req, res) => {
//   try {
//     MongoClient.connect(url, async (err, db) => {
//       try {
//         var dbase = db.db("SuperHeroes");
//         var query2 = {_id:ObjectId(req.params.id)};

//         await dbase
//           .collection("HeroDetails")
//           .deleteOne(query2, async (error, resp) => {
//             await res.send(req.body.heroes);
//             console.log("in delete");
//           });
//       }
//       catch{
//         console.log("eee");
//       }

//     });

//   } catch (err) {
//     console.log("error in deleting");
//   }
// UPDATE USING  PROMISES_______________________________________________
//router.put("/putHero/:id", (req, res) => {
//   router.put("/putHero/", (req, res) => {
// // res.send({type:'PUT'});
//   MongoClient.connect(url, function (err, db) {
//     if (err) console.log("Error in Update");
//     else {
//       var dbase = db.db("SuperHeroes");
//       var myquery = {
//         _id: ObjectId(req.params.id)
//       };
//       var newquery = { $mul: { fightsWon: 3 } };
//       dbase
//         .collection("HeroDetails")
//         .updateOne(myquery, newquery, function (err, res) {
//           if (err) console.log("Error in Update");
//           else {
//             console.log("in Update");
//             console.log(res.result.n + " document(s) Updated");
//           }
//         });
//     }
//   });
// })

router.put("/putHero/:id",auth, (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  // res.send({type:'PUT'});
  MongoClient.connect(url, function(err, db) {
    if (err) console.log("Error in Update");
    else {
      var dbase = db.db("SuperHeroes");
      var myquery = {
        _id: ObjectId(req.params.id)
      };
      var newquery = {
        $set: { heroName: req.body.heroName, 
                heroHeight: req.body.heroHeight,
                canFly: req.body.canFly,
                superPowers: req.body.superPowers,
                heroType: req.body.heroType,
                fanFollowing: req.body.fanFollowing,
                fightsWon: req.body.fightsWon  
              }
      };
      dbase
        .collection("HeroDetails")
        .updateOne(myquery, newquery, function(err, res) {
          if (err) console.log("Error in Update");
          else {
            console.log("in Update");
            console.log(res.result.n + " document(s) Updated");
          }
        });
    }
  });
});

// router.post("/postForm",  (req, res) => {
//   try {
//     MongoClient.connect(url, async (err, db) => {
//       try {
//         const result = joi.validate({password:req.body.password,confirmPassword:req.body.confirmPassword},schema);
//         if(result.error == null && req.body.password==req.body.confirmPassword){
//          // bcrypt.hash(req.password,10).then(hash=>{
//             bcrypt.hash(req.body.password,10).then(hash=>{
//             var dbase = db.db("SuperHeroes");
//              dbase
//           .collection("signforms")
//           .insertOne({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             email: req.body.email, 
//             mobileNumber:req.body.mobileNumber,
//             dateOfBirth:req.body.dateOfBirth,
//             password:hash,
//             confirmPassword:hash
//            }, async (error, resp) => {
//              res.send(req.body);
//             console.log("in insert");
//           });
//           })
        
//       }
//       else{
//         console.log("error in password");
//       }
      
//     }
//        catch {
//         console.log("eee");
//       }
//     });
//   } catch (err) {
//     console.log("error in inserting");
//   }
// });



// router.post("/postSignIn", async (req, res, next) => {
//   // console.log(req.body.email);
//   // console.log(req.body.password);
//   try {
//       let query = { $and: [{ email: req.body.email }, { password: req.body.password }] };
//       await form.find(query, (err, data) => {
//           res.send( data);
//           //console.log("signed in");
//           console.log(data);
//       })
//   }
//   catch (err) {
//       console.log("error");
//   }

// });

// router.post("/postSignIn", async (req, res) => {
//   try {
//     MongoClient.connect(url, async (err, db) => {
//       try {
//         var dbase = db.db("SuperHeroes");
//         //var value1 = JSON.parse(req.headers['canfly']);
//        // console.log(value1);
//         await dbase
//           .collection("signforms")
//           .find({$and: [{ email: req.body.email }, { password: req.body.password }]}).toArray(async (error, resp) => {
//             //await res.send(resp);
//             console.table(resp);
//             console.log("in read");
//           });
//       }
//       catch{
//         console.log("eee");
//       }

//     });

//   } catch (err) {
//     console.log("error in reading");
//   }
// });

// router.post("/postSignIn", async (req, res, next) => {
//   let fetchedAuth;
//   // console.log(req.body.email);
//   // console.log(req.body.password);
//   try {
      
//       await form.findOne({ email: req.body.email }).then(auth=>{
          
//           if(!auth){
//               return res.status(401).json({
//                   message:"email not found",
//               })
//           }
//           fetchedAuth = auth;
//           return bcrypt.compare(req.body.password , auth.password);
          
//       }).then(genuinePassword=>{
//           //console.log("matches");
//           if(!genuinePassword){
//               return res.status(401).json({
//                   message:"password not matched",
//               })
//              // console.log("password incorrect")
//           }
          
//               console.log("hi");
//               const token = jwt.sign(
//                   {email: fetchedAuth.email },
//                   'secret_this_should_be_longer',
//                   {expiresIn: "1h"}
//                   );
//                   res.status(200).json({
                    
//                       token : token,
//                       expiresIn: 3600
//                   })
//                   console.log(token);
      
//               //res.send(genuinePassword);
//               //console.log(genuinePassword);
          
          
//           //console.log(auth)
//       })
//   }
  
//   catch (err) {
//       console.log("error in try");
//   }

// });



router.post("/postForm", async (req, res, next) => {
    //console.log("anike");
  // console.log(req.body.firstName);
   const result = joi.validate({password:req.body.password,confirmPassword:req.body.confirmPassword},schema);
   if(result.error == null && req.body.password==req.body.confirmPassword){
      //console.log("asssss");
          const user = new User(req.body);
          try{
              await user.save().then(response=>{
                  console.log(response);
              });
              const token = await user.generateAuthToken();
              res.status(200).json({user, token });
              //res.send(user);
          }
          catch(e){
              res.status(400).send(e);
          }
          
      
   }
   else{
       console.log("error in pass");
   }
   
   

}


);

router.post("/postSignIn", async (req, res, next) => {
  
  try {
      const user = await User.findByCredentials(req.body.email,req.body.password)
        
      //! we used user instead of User because token will be generated for particular user but not for the whole User model.
      const token = await user.generateAuthToken();
      //console.log(token);
      //console.log(user);
      //console.log(expiresIn);
      res.status(200).json({user, token , expiresIn: 3600 });    
      
      }
  
  catch (e) {
      res.status(400).send();
  }

});


// router.post("/logOutAll", async (req,res,next)=>{
//   try{
//     req.user.tokens = [];
//     await req.user.save();
//     res.send();
//   }
//   catch{
//     res.status(500).send();
//   }
  

// })

router.post("/logOutAll",auth, async (req,res,next)=>{
  console.log("hi");
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token
    });
    
    await req.user.save();
    res.send(req.user);
  }
  catch{
    res.status(500).send();
  }
  

})

module.exports = router;
