import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = []
  async findManyByAnswerdId(answerId: string) {
    const answerAttachments = this.items
      .filter((item) => item.answerId.toString() === answerId)

    return answerAttachments
  }
}
