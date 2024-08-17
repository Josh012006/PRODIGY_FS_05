import mongoose from "mongoose";



const postSchema = new mongoose.Schema({
    userName: String,
    userId: String,
    userProfile: String,
    media: String,
    mediaType: String,
    description: String,
    likes: {
        type:Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
}, {timestamps: true});



const postModel = mongoose.models.Post || mongoose.model("Post", postSchema);

export default postModel;