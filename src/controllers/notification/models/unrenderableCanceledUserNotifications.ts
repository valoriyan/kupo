import { BaseUserNotification } from ".";

export interface UnrenderableCanceledCommentOnPostNotification extends BaseUserNotification {
    postCommentId: string;
}


export interface UnrenderableCanceledNewFollowerNotification extends BaseUserNotification {
    userIdDoingUnfollowing: string;
}


export interface UnrenderableCanceledNewLikeOnPostNotification extends BaseUserNotification {
    userIdUnlikingPost: string;
    postId: string;
}