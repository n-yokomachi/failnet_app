import { ModelInit, MutableModel, PersistentModelConstructor, ManagedIdentifier } from "@aws-amplify/datastore";
import { initSchema } from "@aws-amplify/datastore";

import { schema } from "./schema";



const __modelMeta__ = Symbol('__modelMeta__');

type EagerPostModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostModel, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly content: string;
  readonly author: string;
  readonly authorImage?: string | null;
  readonly reactions?: number | null;
  readonly category?: string | null;
  readonly reactionData?: string | null;
  readonly type?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPostModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PostModel, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly content: string;
  readonly author: string;
  readonly authorImage?: string | null;
  readonly reactions?: number | null;
  readonly category?: string | null;
  readonly reactionData?: string | null;
  readonly type?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

import type { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export declare type PostModel = LazyLoading extends LazyLoadingDisabled ? EagerPostModel : LazyPostModel

export declare const PostModel: (new (init: ModelInit<PostModel>) => PostModel) & {
  copyOf(source: PostModel, mutator: (draft: MutableModel<PostModel>) => MutableModel<PostModel> | void): PostModel;
}



const { Post } = initSchema(schema) as {
  Post: PersistentModelConstructor<PostModel>;
};

export {
  Post
};