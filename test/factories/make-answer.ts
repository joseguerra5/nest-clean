import {faker} from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { Slug } from "@/domain/forum/enterprise/entities/value-objecs/slug";

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