import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objecs/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionsCommentsRepository {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findManyByQuestionIdWithAutor(questionId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId,
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


    return questionComments.map(PrismaCommentWithAuthorMapper.toDoomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPersistence(questionComment)

    await this.prisma.comment.create({
      data,
    })
  }
  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      }
    })

    if (!questionComment) {
      return null
    }

    return PrismaQuestionCommentMapper.toDoomain(questionComment)
  }
  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    })


    return questionComments.map(PrismaQuestionCommentMapper.toDoomain)
  }
  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }
}