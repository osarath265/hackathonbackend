const mongoose = require('mongoose');


const user = mongoose.Schema(
    {
        _id:mongoose.Schema.Types.ObjectId,
        email:
        {
            type:String,
            unique:true
        },
        username:
        {
            type:String,
        },
        password:
        {
            type:String,
        },
        verified: {
            type: Boolean,
            default: false 
        },
        checksum:{
            type:Number,
            default:0
        }
    },

)


module.exports = mongoose.model('authdata',user);