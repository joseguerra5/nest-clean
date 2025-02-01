import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent({
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'New question',
    })

    await Promise.all([
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'answer 02',
      }),
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'answer 01',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: 'answer 01' }),
        expect.objectContaining({ content: 'answer 02' }),
      ]),
    })
  })
})
