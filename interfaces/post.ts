export default interface Post {
    _id?: string,
    media: string,
    mediaType: string,
    description: string,
    likes: number,
    tags: string[],
    comments: string[],
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}