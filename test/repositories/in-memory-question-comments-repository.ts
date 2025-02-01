import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentRepository } from './in-memory-student-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objecs/comment-with-author'

export class InMemoryQuestionCommentRepository
  implements QuestionsCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private inMemoryStudentsRepository: InMemoryStudentRepository) {}

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAutor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.inMemoryStudentsRepository.items.find((student) => {
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

    return questionComments
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIndex, 1)
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }
}
