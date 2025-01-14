
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment"


export interface AnswerAttachmentsRepository {
  findManyByAnswerdId(answerId: string): Promise<AnswerAttachment[]>
}

