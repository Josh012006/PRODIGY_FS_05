export default interface Comment {
    _id?: string,
    issuer: string,
    issuerUsername: string,
    content: string,
    likes: string[],
    dislikes: string[],
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}

