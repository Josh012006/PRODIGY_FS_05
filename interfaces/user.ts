export default interface User {
    _id?: string,
    name: string,
    username: string,
    bio: string,
    profilePicture: string,
    story: string,
    email: string,
    password: string,
    posts: string[],
    followers: string[],
    following: string[],
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}