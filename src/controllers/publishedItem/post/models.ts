import { MediaElement } from "../../models";
import { BaseRenderablePublishedItem, PublishedItemType } from "../models";

export interface RootRenderablePost extends BaseRenderablePublishedItem {
  type: PublishedItemType.POST;
  mediaElements: MediaElement[];
}

export interface SharedRenderablePost extends BaseRenderablePublishedItem {
  type: PublishedItemType.POST;
  sharedItem: RootRenderablePost;
}

export type RenderablePost = RootRenderablePost | SharedRenderablePost;
