export default interface Comment {
    _id?: string,
    issuer: string,
    content: string,
    likes: number,
    replies: string[],
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}

