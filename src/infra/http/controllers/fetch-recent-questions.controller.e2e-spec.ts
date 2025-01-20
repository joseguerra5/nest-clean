import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from "supertest";
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe("Fetch recent questions (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    })
      .compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /questions", async () => {
    const user = await studentFactory.makePrismaStudent({
      password: await hash("123456", 8),
    })

    const accessToken = jwt.sign({ sub: user.id })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: "New question"
      }),

      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: "New question 02"
      })
    ])

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: "New question" }),
        expect.objectContaining({ title: "New question 02" })
      ]
    })
  })
})