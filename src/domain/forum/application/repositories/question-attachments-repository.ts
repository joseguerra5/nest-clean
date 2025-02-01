import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>
  abstract findManyByQuestiondId(
    questionId: string,
  ): Promise<QuestionAttachment[]>

  abstract deleteManyByQuestiondId(questionId: string): Promise<void>
}
