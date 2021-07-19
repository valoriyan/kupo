export interface FrontendClientUser {
    username: string;
    followersCount: number;
    subscribersCount: number;
}

export interface FrontendContentProviderPage {
    client: FrontendClientUser;

    followersCount: number;
    subscribersCount: number;
    followingCount: number;

    bioText: string;

    isBeingFollowedByClientUser: boolean;
    isFollowingClientUser: boolean;


    mostRecentPosts: [];

}
