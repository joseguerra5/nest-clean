import {faker} from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objecs/slug";

export function makeQuestion(
  // overide faz receber todas as propriedades do questionprops como opcional
  overide: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
     const question = Question.create({
        authorId: new UniqueEntityId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.text(),
        slug: Slug.create("example-question"),
        ...overide
      }, id)
  
      return question
}