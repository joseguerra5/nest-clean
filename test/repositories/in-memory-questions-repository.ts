import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) { }
  public items: Question[] = []

  async findManyRecents({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }
  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(question.attachments.getNewItems())
    await this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }
  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestiondId(
      question.id.toString()
    )
  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async create(question: Question) {
    this.items.push(question)

    //salvo os question attachments no repositorio
    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
