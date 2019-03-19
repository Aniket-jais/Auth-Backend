const mongoose = require('mongoose');

const formSchema = mongoose.Schema({
    heroName:{
        type:String
    },
    heroHeight:{
        type:String
    },
    canFly:{
        type: Boolean
    }, 
    heroType:{
        type:Boolean
    },
    superPowers:{
        type:String
    },
    fanFollowing:{
        type:Number
    },
    fightsWon:{
        type:Number
    }
});

const Form = mongoose.model('HeroDetails',formSchema);
module.exports = Form;