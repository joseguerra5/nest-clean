import { UniqueEntityId } from '../../../..//core/entities/unique-entity-id'
import {
  Comment as PrismaComment,
  Prisma,
  User as PrismaUser,
} from '@prisma/client'
import { QuestionComment } from '../../../../domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objecs/comment-with-author'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}
export class PrismaCommentWithAuthorMapper {
  static toDoomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }

  static toPersistence(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
