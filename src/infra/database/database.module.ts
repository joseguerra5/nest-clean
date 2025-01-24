import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionAttachmentRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answer-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answer-repository";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { PrismaAttachmentRepository } from "./prisma/repositories/prisma-attachment-repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachment-repository";

@Module({
  // para importar o Prismaservice em outros modulos precisa também fazer o export, dai fica disponível para outros modulos que exportarem esse modulo
  providers: [
    PrismaService,
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: QuestionsCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    }, {
      provide: AnswersRepository,
      useClass: PrismaAnswerRepository,
    }, {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
  ],
  exports: [
    StudentsRepository,
    PrismaService,
    QuestionAttachmentsRepository,
    QuestionsCommentsRepository,
    QuestionsRepository,
    AnswerAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AttachmentsRepository
  ],
})
export class DatabaseModule { }