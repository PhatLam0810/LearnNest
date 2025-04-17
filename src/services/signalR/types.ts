export enum REALTIME_COMMENT_TYPE {
  COMMENT = 'Comment',
  REPLY = 'Reply',
  UPDATE = 'Update',
}

export enum MICRO_SERVICE {
  ADMIN = 'Admin',
  ANALYTIC = 'Analytic',
  COMIC = 'Comic',
  DOCUMENT = 'Document',
  IDENTITY = 'Identity',
  MEDIA = 'Media',
  REALTIME = 'Realtime',
  SOCIAL = 'Social',
  STORY = 'Story',
  WALLET = 'Wallet',
}

export interface RealTimeCommentData {
  AuthorId: string;
  AuthorName: string;
  CommentDate: string;
  CommentText: string;
  GifId: any;
  Id: string;
  Mentions: any[];
  PostCreatedBy: string;
  PostHashId: string;
  PostId: string;
  ResourceHashId: any;
  ResourceUrl: any;
  Type: string;
  UserAvatar: string;
}
export interface RealTimeUpdateCommentData extends RealTimeReplyCommentData {
  CommentText: string;
  CustomNote: any;
}
export interface RealTimeReplyCommentData {
  AuthorId: string;
  AuthorName: string;
  GifId: null | string;
  Id: string;
  Mentions: mention[];
  PostCreatedBy: string;
  PostHashId: null | string;
  PostId: string;
  PostIdOfPost: string;
  ReplyDate: string;
  ReplyText: string;
  ReplyToCommentId: string;
  ResourceHashId: null | string;
  ResourceUrl: null | string;
  Type: string;
  UserAvatar: string;
  CustomNote: any;
}

export interface RealTimeSendCommentBaseData {
  postId: string;
  resourceHashId?: string;
  type?: 'post' | 'subPost';
  mentions?: mention[];
  gifId?: string;
  microService?: MICRO_SERVICE;
  customNote?: string;
  paragraphId?: string;
}
export interface RealTimeSendCommentData extends RealTimeSendCommentBaseData {
  commentText?: string;
}

export interface RealTimeSendUpdateCommentData extends RealTimeSendCommentData {
  commentId?: string;
}

export interface RealTimeSendReplyCommentData
  extends RealTimeSendCommentBaseData {
  replyText?: string;
  replyToCommentId?: string;
}

type mention = {
  entityId: string;
  text: string;
  Length: number;
  Offset: number;
};

export type commentData = {
  id: string;
  postIdOfPost: string;
  body: string;
  authorId: string;
  authorName: string;
  userName: string;
  userAvatar: string;
  commentDate?: string;
  gifId: string;
  resourceHashId: string;
  resourceUrl: string;
  mentions: mention[];
  parentId?: string;
  lastModifiedDate: string;
  postId?: string;
  customNote: any;
  replies: {
    data: commentData[];
    totalReply: number;
  };
};

export interface updateCommentData extends commentData {
  PostId: string;
  AuthorId: string;
  AuthorName: string;
  CommentDate: string;
  CommentText: string;
  GifId: any;
  Id: string;
  Mentions: any[];
  PostCreatedBy: string;
  PostHashId: string;
  ResourceHashId: any;
  ResourceUrl: any;
  Type: string;
  UserAvatar: string;
}

export interface NotificationReceivedData {
  Id: string;
  Status: string;
  TargetType: string;
  LocationId: string;
  LocationHashId: string;
  EntityId: string;
  EntityHashId: any;
  Message: string;
  ActorId: string;
  ActorName: string;
  CreatedOn: string;
  NotificationType: string;
  UserAvatar: any;
}

export interface RealtimeCommentBaseData {
  AuthorId: string;
  AuthorName: string;
  CustomNote: string;
  GifId: any;
  Id: string;
  Mentions: any[];
  Order: any;
  PostCreatedBy: string;
  PostHashId: any;
  PostId: string;
  PostIdOfPost: string;
  PostType: number;
  ResourceHashId: any;
  ResourceUrl: any;
  Type: string;
  UserAvatar: string;
  UserName: any;
}

export interface RealtimeCommentData extends RealtimeCommentBaseData {
  CommentDate: string;
  CommentText: string;
}

export interface RealtimeCommentUpdateData extends RealtimeCommentData {
  //
}

export interface RealtimeCommentReplyData extends RealtimeCommentBaseData {
  QuoteId: any; //string;
  ReplyCommentId: string; //
  ReplyDate: string; //
  ReplyText: string; //
  ReplyToCommentId: string; //
}

export interface CommentBaseData {
  authorId: string;
  authorName: string;
  customNote: string;
  gifId: any;
  id: string;
  mentions: any[];
  order: any;
  postCreatedBy: string;
  postHashId: any;
  postId: string;
  postIdOfPost: string;
  postType: number;
  resourceHashId: any;
  resourceUrl: any;
  type: string;
  userAvatar: string;
  userName: any;
  replies?: {
    data: commentData[];
    totalReply: number;
  };
}

export interface CommentData extends CommentBaseData {
  [x: string]: any;
  commentDate: string;
  commentText: string;
}

export interface CommentUpdateData extends CommentBaseData {
  //
}

export interface CommentReplyData extends CommentBaseData {
  quoteId: any; //string;
  replyCommentId: string; //
  replyDate: string; //
  replyText: string; //
  replyToCommentId: string; //
}

export type ConvertRealtimeToData<T> = T extends RealTimeCommentData
  ? CommentData
  : T extends RealtimeCommentReplyData
    ? CommentReplyData
    : T extends RealtimeCommentUpdateData
      ? CommentUpdateData
      : never;
