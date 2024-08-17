export default interface Post {
    _id?: string,
    userName: string,
    userId: string,
    userProfile: string,
    media: string,
    mediaType: string,
    description: string,
    likes: string[],
    tags: string[],
    comments: string[],
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}