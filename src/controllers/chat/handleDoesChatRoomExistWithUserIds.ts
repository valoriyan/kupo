import express from "express";
import { v4 as uuidv4 } from "uuid";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { ChatController } from "./chatController";

export interface DoesChatRoomExistWithUserIdsRequestBody {
    userIds: string[];
}
  
export interface SuccessfullyDeterminedIfChatRoomExistsWithUserIdsResponse {
    chatRoomId?: string;
}  

export enum FailedtoDetermineIfChatRoomExistsWithUserIdsReason {
    UnknownCause = "Unknown Cause",
    IllegalAccess = "Illegal Access",
}
  
export interface FailedtoDetermineIfChatRoomExistsWithUserIds {
    reason: FailedtoDetermineIfChatRoomExistsWithUserIdsReason;
}
  

export async function handleDoesChatRoomExistWithUserIds({
    controller,
    request,
    requestBody,
  }: {
    controller: ChatController;
    request: express.Request;
    requestBody: DoesChatRoomExistWithUserIdsRequestBody;
  }): Promise<
  SecuredHTTPResponse<
  FailedtoDetermineIfChatRoomExistsWithUserIds,
    SuccessfullyDeterminedIfChatRoomExistsWithUserIdsResponse
  >
> {
    const {userIds} = requestBody;

    const { clientUserId, error } = await checkAuthorization(controller, request);
    if (error) return error;
    
    if (!userIds.includes(clientUserId)) {
        return {error: {reason: FailedtoDetermineIfChatRoomExistsWithUserIdsReason.IllegalAccess}}
    }
  
    const chatRoomId = await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.getChatRoomIdWithUserIdMembersExclusive({userIds});

    if (!!chatRoomId) {
        return {
            success: {
                chatRoomId,
            }
        };    
    }

    const newChatRoomId: string = uuidv4();

    await controller.databaseService.tableNameToServicesMap.chatRoomsTableService.insertUsersIntoChatRoom({
        userIds,
        joinTimestamp: Date.now(),
        chatRoomId: newChatRoomId,
    });

    return {
        success: {
            chatRoomId: newChatRoomId,
        }
    };


}