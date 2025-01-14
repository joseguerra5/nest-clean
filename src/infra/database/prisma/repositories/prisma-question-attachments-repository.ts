import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaQuestionAttachmentRepository implements QuestionAttachmentsRepository {
  findManyByQuestiondId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error("Method not implemented.");
  }
}