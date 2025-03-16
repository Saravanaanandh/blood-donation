import mongoose from 'mongoose'
import bcrypt, { genSalt } from 'bcryptjs'
import jwt from 'jsonwebtoken'

// import { DataTypes } from 'sequelize'
// import sequelize from './../config/dbConn.js'

const userSchema = new mongoose.Schema({
// const User = sequelize.define("User",{
    // id:{
    //     type:DataTypes.INTEGER,
    //     autoIncrement:true,
    //     primaryKey:true
    // },
    username:{
        type:String,
        required:true,
        maxlength:30
        // type:DataTypes.STRING,
        // allowNull:false
    },
    age:{
        type:Number,
        required:true
        // type:DataTypes.INTEGER,
        // allowNull:false
    },
    gender:{
        type:String,
        enum:["MALE","FEMALE"],
        set:value => value.toUpperCase(),
        required:true
        // type:DataTypes.ENUM("MALE","FEMALE"),
        // allowNull:false,
        // set(value){
        //     this.setDataValue("gender",value.toUpperCase())
        // }
    },
    bloodType:{
        type:String,
        required:true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-',"A1+", "A1-", "A2+", "A2-", "A1B+","A1B-", "A2B+", "A2B-", "BOMBAY BLOOD GROUP"],
        set: value => value.toUpperCase()
        // type:DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-',"A1+", "A1-", "A2+", "A2-", "A1B+","A1B-", "A2B+", "A2B-", "BOMBAY BLOOD GROUP"),
        // allowNull:false,
        // set(value){
        //     this.setDataValue("bloodType", value.toUpperCase())
        // }
    },
    location:{
        type:String,
        required:true
        // type:DataTypes.STRING,
        // allowNull:false
    },
    pinCode:{
        type:Number,
        required:true
        // type:DataTypes.INTEGER,
        // allowNull:false
    },
    mobile:{
        type:Number,
        required:true,
        maxlength:12
        // type:DataTypes.BIGINT,
        // allowNull:false,
        // validate:{
        //     min:1000000000,
        //     max:9999999999
        // }
        
    },
    email:{
        type:String,
        required:true,
        match:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique:true 
        // type:DataTypes.STRING,
        // allowNull:false,
        // unique:true,
        // validate:{
        //     isEmail:true
        // }
    },
    password:{
        type:String,
        required:true,
        minlength:6
        // type:DataTypes.STRING,
        // allowNull:false,
        // validate:{
        //     len:[6,20]
        // }
    },
    donation:{
        type:Number,
        default:0
        // type:DataTypes.INTEGER,
        // defaultValue:0
    },
    available:{
        type:Boolean, 
        default:true
        // type:DataTypes.BOOLEAN,
        // defaultValue:true
    },
    profile:{
        type:String,
        dafault:""
        // type:DataTypes.STRING,
        // defaultValue:""
    },
    banner:{
        type:String,
        dafault:""
        // type:DataTypes.STRING,
        // defaultValue:""
    },
    tattooIn12:{
        type:Boolean,
        dafault:false
        // type:DataTypes.BOOLEAN,
        // defaultValue:false
    },
    positiveHIVTest:{
        type:Boolean,
        dafault:false
        // type:DataTypes.BOOLEAN,
        // defaultValue:false
    },
    lastDonated:{
        type:String
        // type:DataTypes.STRING
    },
    nextDonationDate:{
        type:String
        // type:DataTypes.STRING 
    },
    recipientId:{
        type:mongoose.Types.ObjectId 
        // type:DataTypes.UUID
    },
    donorId:{
        type:mongoose.Types.ObjectId 
        // type:DataTypes.UUID
    },
    weight:String,
    token:String,
    // token:DataTypes.STRING
},{timestamps:true})

userSchema.pre('save',async function(next){
    // User.beforeCreate(async function(user){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.createJWT = function(){
    return jwt.sign({
            userId:this._id
        },
        process.env.JWT_SECRET,
        {expiresIn:'30d'}
    )
}

userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatchPassword = await bcrypt.compare(candidatePassword, this.password)
    return isMatchPassword
}

const User = mongoose.model('User',userSchema)

// User.prototype.createJWT = function () {
//     return jwt.sign(
//       { userId: this.id }, // `this.id` refers to the Sequelize user ID
//       process.env.JWT_SECRET,
//       { expiresIn: "30d" }
//     );
//   };
  
//   // Instance method to compare passwords
//   User.prototype.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
//   };

export default User