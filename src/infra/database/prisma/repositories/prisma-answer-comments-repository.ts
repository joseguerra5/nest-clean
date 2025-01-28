import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prima-answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objecs/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(
    private prisma: PrismaService,
  ) { }
  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })


    return answerComments.map(PrismaCommentWithAuthorMapper.toDoomain)
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistence(answerComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      }
    })

    if (!answerComment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDoomain(answerComment)
  }
  async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })


    return comments.map(PrismaAnswerCommentMapper.toDoomain)
  }
  async delete(questionComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      }
    })
  }
}