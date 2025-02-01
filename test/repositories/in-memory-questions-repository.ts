import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objecs/question-details'
import { InMemoryAttachmentRepository } from './in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachment-repository'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryQuestionRepository implements QuestionsRepository {
  public items: Question[] = []
  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentRepository,
    private studentRepository: InMemoryStudentRepository,
  ) {}

  async findBySlugWithDetails(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      },
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })
      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: author.id,
      author: author.name,
      attachments,
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      slug: question.slug,
      title: question.title,
      bestAnswerId: question.bestAnswerId,
    })
  }

  async findManyRecents({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )
    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

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
      question.id.toString(),
    )
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async create(question: Question) {
    this.items.push(question)

    // salvo os question attachments no repositorio
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
