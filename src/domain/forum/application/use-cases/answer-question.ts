import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answer-repository'
import { AnswerAttatchmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, {
  answer: Answer
}>

export class AnswerQuestionUseCase {
  // dependencias
  constructor(private answersRepository: AnswersRepository) { }
  // ter apenas um metodo, responsabilidade única do solid
  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {

    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      attachments: new AnswerAttatchmentList([]),
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttatchmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
