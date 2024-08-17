import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    story: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    }, 
    following: {
        type: Array,
        default: []
    }

}, {timestamps: true});


const userModel = mongoose.models.User || mongoose.model("User", userSchema);


export default userModel;