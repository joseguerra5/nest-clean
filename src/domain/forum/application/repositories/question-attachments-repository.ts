
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"


export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestiondId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestiondId(questionId: string): Promise<void>
}

