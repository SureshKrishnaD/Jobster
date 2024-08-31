//packages required
const mongoose = require('mongoose');

//schema of the Hirer database

const hiererschema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        pass:{
            type:String,
            required:true,
            unique:true,
        },
        projects:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hierer',
        }]
    }
    ,
    {collection:'Hierer'}
)

//exporting the hirer as a model

const Hierer = mongoose.model('Hierer',hiererschema);
module.exports = Hierer;