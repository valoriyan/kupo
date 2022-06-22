import { MediaElement } from "../../models";
import { BasePublishedItem, PublishedItemType } from "../models";

export interface RootRenderablePost extends BasePublishedItem {
  type: PublishedItemType.POST;
  mediaElements: MediaElement[];
}

export interface SharedRenderablePost extends BasePublishedItem {
  type: PublishedItemType.POST;
  sharedItem: RootRenderablePost;
}


export type RenderablePost  = RootRenderablePost | SharedRenderablePost;