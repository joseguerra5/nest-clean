
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"


export interface QuestionAttachmentsRepository {
  findManyByQuestiondId(questionId: string): Promise<QuestionAttachment[]>
}

