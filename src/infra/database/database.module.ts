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

@Module({
  // para importar o Prismaservice em outros modulos precisa também fazer o export, dai fica disponível para outros modulos que exportarem esse modulo
  providers: [
    PrismaService,
    PrismaQuestionAttachmentRepository,
    PrismaQuestionCommentsRepository,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentsRepository,
  ],
  exports: [
    StudentsRepository,
    PrismaService,
    PrismaQuestionAttachmentRepository,
    PrismaQuestionCommentsRepository,
    QuestionsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentsRepository,
  ],
})
export class DatabaseModule { }