// interface para dizer os metodos que o repositorio tem que ter

import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objecs/question-details'

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findBySlugWithDetails(slug: string): Promise<QuestionDetails | null>
  abstract findManyRecents(params: PaginationParams): Promise<Question[]>
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
}
