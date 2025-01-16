import {
  BadRequestException,
  Body, ConflictException, Controller,
  HttpCode,
  Post,
  UsePipes
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exist-error'
import { Public } from '@/infra/auth/public'

export const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

// tem que ser feito uma rota para o controller

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private createStudent: RegisterStudentUseCase) { }
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body

    const result = await this.createStudent.execute({
      email,
      name,
      password
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
