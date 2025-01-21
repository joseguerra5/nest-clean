import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { Question } from "../../enterprise/entities/question";
import { AnswersRepository } from "../repositories/answer-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResouceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface ChooseQuestionBestAnswerAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerAnswerUseCaseResponse = Either<NotAllowedError | ResouceNotFoundError, {
  question: Question
}>

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private questionRepository: QuestionsRepository
  ) { }
  async execute({
    answerId,
    authorId
  }: ChooseQuestionBestAnswerAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResouceNotFoundError())
      throw new Error("Answer not found.")
    }

    const question = await this.questionRepository.findById(answer.questionId.toString())

    if (!question) {
      return left(new ResouceNotFoundError())

      throw new Error("Question not found.")
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())

      throw new Error("Not Allowed.")
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })
  }
}