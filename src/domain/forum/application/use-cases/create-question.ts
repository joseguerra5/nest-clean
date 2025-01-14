import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseReponse = Either<null, {
  question: Question
}>

@Injectable()
export class CreateQuestionUseCase {
  // dependencias
  constructor(private questionsRepository: QuestionsRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    authorId,
    content,
    title,
    attachmentsIds
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseReponse> {
    const question = Question.create({
      content,
      authorId: new UniqueEntityId(authorId),
      title
    })
    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({
      question
    })
  }
}
