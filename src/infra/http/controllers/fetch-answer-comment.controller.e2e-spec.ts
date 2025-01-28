import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from "supertest";
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe("Fetch answers comments (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerCommentsFactory: AnswerCommentFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory, AnswerCommentFactory, AnswerFactory],
    })
      .compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentsFactory = moduleRef.get(AnswerCommentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /answers/:answerId/comments", async () => {
    const user = await studentFactory.makePrismaStudent({
      password: await hash("123456", 8),
      name: "John Doe"
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: "New question"
    })

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    })


    await Promise.all([
      answerCommentsFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: "comment 02"
      }),
      answerCommentsFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: "comment 01"
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: "comment 01", authorName: "John Doe" }),
        expect.objectContaining({ content: "comment 02", authorName: "John Doe" })
      ])
    })
  })
})