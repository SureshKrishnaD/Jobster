//packages required
const mongoose = require('mongoose');

//schema of the Order database 

const orderschema = mongoose.Schema(
    {
        Hid:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hierer',
            required:true,
        },
        Wid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Employee',
            required:true,
        },
       Pid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Projects',
        required:true,
       }
    },
    {collection:'Orders'},
    { versionKey: false }

)

//exporting order schema as a model
const Order = mongoose.model('Order',orderschema);
module.exports = Order;