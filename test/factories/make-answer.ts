import {faker} from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";

export function makeAnswer(
  // overide faz receber todas as propriedades do answerprops como opcional
  overide: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
     const answer = Answer.create({
        authorId: new UniqueEntityId(),
        content: faker.lorem.text(),
        questionId: new UniqueEntityId(),
        ...overide
      }, id)
  
      return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer)
    })

    return answer
  }
}