import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment";

export function makeAnswerComment(
  // overide faz receber todas as propriedades do answerprops como opcional
  overide: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
) {
  const answerComment = AnswerComment.create({
    authorId: new UniqueEntityId(),
    content: faker.lorem.text(),
    answerId: new UniqueEntityId(),
    ...overide
  }, id)

  return answerComment
}