//packages required
const mongoose = require('mongoose');

//schema of the Employee database

const employeeschema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
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
        skills:{
            type:String,
        },
        project_applied:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Projects'
        }
        ],
        gig:[
            {
                title:String,
                description:String,
                domain:String,
                link:String,
            }
        ]

    },{collection:'Employee'}
)

//converting model into employee variable 

const Employee = mongoose.model('Employee',employeeschema);

//exporting the employee

module.exports = Employee;