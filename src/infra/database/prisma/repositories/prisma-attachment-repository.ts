import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachment-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";

@Injectable()
export class PrismaAttachmentRepository implements AttachmentsRepository {
  constructor(
    private prisma: PrismaService,
  ) { }
  async create(attach: Attachment) {
     const data = PrismaAttachmentMapper.toPersistence(attach)
    
        await this.prisma.attachment.create({
          data,
        }) 
      }
  }
