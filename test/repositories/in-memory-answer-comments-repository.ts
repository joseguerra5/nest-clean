import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objecs/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryAnswerCommentRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  constructor(
    private inMemoryStudentsRepository: InMemoryStudentRepository
  ) { }

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {
        const author = this.inMemoryStudentsRepository.items.find(student => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error('Author not found')
        }

        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return answerComments
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answersComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answersComments
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }
  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answerComment.id)

    this.items.splice(itemIndex, 1)
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }


}
