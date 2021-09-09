import express from "express";
import { DBPost } from "src/services/databaseService/tableServices/postsTableService";
import { DBUser } from "src/services/databaseService/tableServices/usersTableService";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/authUtilities";
import { UserPageController } from "./userPageController";

export interface GetUserProfileParams {
  username?: string;
}

export interface DisplayedPost {
  imageUrl: string;
  creatorUsername: string;
  creationTimestamp: number;
  caption: string;
  likes: {
    count: number;
  };
  comments: {
    count: number;
  };
  shares: {
    count: number;
  };
}

export interface DisplayedShopItems {
  title: string;
  price: number;
  description: string;
  countSold: number;
}

export interface SuccessfulGetUserProfileResponse {
  username: string;
  followers: {
    count: number;
  };
  subscribers: {
    count: number;
  };
  follows: {
    count: number;
  };
  bio: string;
  posts: DisplayedPost[];
  shopItems: DisplayedShopItems[];
}

export enum DeniedGetUserProfileResponseReason {
  Blocked = "Blocked",
  NotFound = "User Not Found",
}

export interface DeniedGetUserProfileResponse {
  reason: DeniedGetUserProfileResponseReason;
}

export async function handleGetUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: GetUserProfileParams;
}): Promise<
  SecuredHTTPResponse<DeniedGetUserProfileResponse, SuccessfulGetUserProfileResponse>
> {
  let user: DBUser | undefined;
  if (requestBody.username) {
    // Fetch user profile by given username
    user =
      await controller.databaseService.tableServices.usersTableService.selectUserByUsername(
        {
          username: requestBody.username,
        },
      );
  } else {
    // Fetch user profile by own userId
    const { userId, error } = await checkAuthorization(controller, request);
    if (error) return error;
    user =
      await controller.databaseService.tableServices.usersTableService.selectUserByUserId(
        { userId },
      );
  }

  if (!user) {
    controller.setStatus(404);
    return { error: { reason: DeniedGetUserProfileResponseReason.NotFound } };
  }

  const numberOfFollowersOfUserId: number =
    await controller.databaseService.tableServices.userFollowsTableService.countFollowersOfUserId(
      {
        userIdBeingFollowed: user.id,
      },
    );

  const numberOfFollowsByUserId: number =
    await controller.databaseService.tableServices.userFollowsTableService.countFollowsOfUserId(
      {
        userIdDoingFollowing: user.id,
      },
    );

  const posts =
    await controller.databaseService.tableServices.postsTableService.getPostsByCreatorUserId(
      {
        creatorUserId: user.id,
      },
    );

  return {
    success: {
      username: user.username,
      followers: {
        count: numberOfFollowersOfUserId,
      },
      subscribers: {
        count: 0,
      },
      follows: {
        count: numberOfFollowsByUserId,
      },
      bio: user.short_bio,
      posts: postsToDisplayPosts(posts, user.username),
      shopItems: [],
    },
  };
}

const postsToDisplayPosts = (posts: DBPost[], userName: string) =>
  posts.map((post) => {
    return {
      imageUrl: post.image_blob_filekey,
      creatorUsername: userName,
      creationTimestamp: 0,
      caption: post.caption,
      likes: {
        count: 0,
      },
      comments: {
        count: 0,
      },
      shares: {
        count: 0,
      },
    };
  });
