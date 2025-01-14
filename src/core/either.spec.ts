import { Either, left, right } from "./either"

function doSomething(x: boolean): Either<string, number> {
  if (x) {
    return right(10)
  } else {
    return left("error")
  }
}
test("success result", ()=> {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
})

test("error result", ()=> {
  const result = doSomething(false)

  expect(result.isRight()).toBe(false)
})