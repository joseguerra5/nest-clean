import { UniqueEntityId } from '../../../..//core/entities/unique-entity-id'
import {
  Question as PrismaQuestion,
  Prisma,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { QuestionComment } from '../../../../domain/forum/enterprise/entities/question-comment'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objecs/question-details'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'
import { Slug } from '@/domain/forum/enterprise/entities/value-objecs/slug'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      title: raw.title,
      content: raw.content,
      slug: Slug.create(raw.slug),
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
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
