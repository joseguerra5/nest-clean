// interface para dizer os metodos que o repositorio tem que ter

import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(questionId: string, params: PaginationParams): Promise<AnswerComment[]>
  delete(questionComment: AnswerComment): Promise<void>
}
