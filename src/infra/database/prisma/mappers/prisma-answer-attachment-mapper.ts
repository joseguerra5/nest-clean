import { UniqueEntityId } from "../../../..//core/entities/unique-entity-id";
import { Attachment as PrismaAttachment, } from "@prisma/client";
import { AnswerAttachment } from "../../../../domain/forum/enterprise/entities/answer-attachment"

export class PrismaAnswerAttachmentMapper {
  static toDoomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error("Invalid attachment type")
    }

    return AnswerAttachment.create({
      attachmentId: new UniqueEntityId(raw.id),
      answerId: new UniqueEntityId(raw.answerId),
    }, new UniqueEntityId(raw.id))
  }
}