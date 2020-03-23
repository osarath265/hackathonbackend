const mongoose = require('mongoose');


const board = mongoose.Schema(
    {
        email:{
            type:String
        },
        boards:[
            {
            name:String,
            Tasks:[
                {
                    name:String,
                    lists:[
                        {
                            name:String,
                            description:String
                        }
                    ]
                }
        ]
        }
        ]
    }
   
)


module.exports = mongoose.model('board', user);