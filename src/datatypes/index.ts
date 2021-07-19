export interface User {
    username: string;
}

export interface UserWithPassword extends User {
    encryptedPassword: string;
    salt: string;
}


export enum MediaItemType {
    Image = "Image",
    Video = "Video",
}
export interface MediaItem {
    url: string;
    type: MediaItemType;
}

