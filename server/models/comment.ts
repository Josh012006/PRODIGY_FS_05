import mongoose from "mongoose";



const commentSchema = new mongoose.Schema({
    issuer: String,
    issuerUsername: String,
    content: String,
    likes: {
        type: Array,
        default: []
    },
    dislikes: {
        type: Array,
        default: []
    }
}, {timestamps: true});


const commentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default commentModel;