import { Either, left, right } from '@/core/either'
import { Question, QuestionProps } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResouceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface EditQuestionUseCaseRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseReponse = Either<NotAllowedError | ResouceNotFoundError, {
  question: Question
}>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentRepository: QuestionAttachmentsRepository
  ) { }
  async execute({
    questionId,
    authorId,
    content,
    title,
    attachmentsIds
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseReponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments = await this.questionAttachmentRepository.findManyByQuestiondId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)

    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id
      })
    })

    questionAttachmentList.update(questionAttachments)



    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    return right({
      question
    })
  }
}
