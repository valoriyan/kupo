export interface User {
    username: string;
}

export interface UserWithPassword extends User {
    encryptedPassword: string;
}