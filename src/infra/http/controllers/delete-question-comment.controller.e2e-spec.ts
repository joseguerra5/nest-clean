import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from "supertest"
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe("Delete comment on question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let commentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory, QuestionCommentFactory]
    })
      .compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    commentFactory = moduleRef.get(QuestionCommentFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[DELETE] /questions/:id/comments", async () => {
    const user = await studentFactory.makePrismaStudent({
      password: await hash("123456", 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })

    const questionComment = await commentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id
    })

    const response = await request(app.getHttpServer())
      .delete(`/questions/${questionComment.id.toString()}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        id: questionComment.id.toString()
      }
    })

    expect(commentOnDatabase).toBeFalsy()
  })
})