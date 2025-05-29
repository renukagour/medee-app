import { Schema,model,models } from "mongoose";

const UserSchema=new Schema({
    clerkId:{
        type:String,
        required:true,
        unique:true,
    },
    email :{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true,
    }
})

const User= models?.User || model("User",UserSchema);

export default User;