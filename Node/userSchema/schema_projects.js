//packages required
const mongoose = require('mongoose');

//schema of the Project database
const projectschema = mongoose.Schema({
    hirer:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    domain:{
        type:String,
        required:true,
    },
    requirements:{
        type:String,
        required:true,
    },
    deadline:{
        type:Date,
        required:true,
    },
    Applied_by:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Employee'
        }
    ]
    
}
,{collection:'Projects'}
)

//exporting as a model
const Project = mongoose.model('Project',projectschema);

module.exports = Project;