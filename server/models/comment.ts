import mongoose from "mongoose";



const commentSchema = new mongoose.Schema({
    issuer: String,
    content: String,
    likes: {
        type: Number,
        default: 0
    },
    replies: {
        type: Array,
        default: []
    }
}, {timestamps: true});


const commentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default commentModel;