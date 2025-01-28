import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objecs/comment-with-author";

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAutor: CommentWithAuthor) {
    return {
      commentId: commentWithAutor.commentId.toString(),
      authorId: commentWithAutor.authorId.toString(),
      authorName: commentWithAutor.author,
      content: commentWithAutor.content,
      createdAt: commentWithAutor.createdAt,
      updatedAt: commentWithAutor.updatedAt,

    }
  }
}