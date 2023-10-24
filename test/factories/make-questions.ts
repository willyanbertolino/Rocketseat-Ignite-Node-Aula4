import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import { QuestionProps, Questions } from "../../src/domain/forum/enterprise/entities/questions";
import { faker } from '@faker-js/faker'

export function makeQuestion(
    override: Partial<QuestionProps> = {}, 
    id?: UniqueEntityID
    ) {
    const question = Questions.create({
        authorId: new UniqueEntityID(),
        title: faker.lorem.sentence(),
        content: faker.lorem.text(),
        ...override
    },
    id
    )

    

    return question
}

