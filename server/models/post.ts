import mongoose from "mongoose";



const postSchema = new mongoose.Schema({
    media: String,
    mediaType: String,
    description: String,
    likes: {
        type: Number,
        default: 0
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