import { Either, left, right } from "../../../../core/either";
import { Questions } from "../../enterprise/entities/questions";
import { QuestionsRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface GetQuestionsBySlugRequest {
    slug: string
}

type GetQuestionsBySlugResponse = Either< ResourceNotFoundError, {
    question: Questions
}>


export class GetQuestionsBySlugUseCase {
    constructor (
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ slug }: GetQuestionsBySlugRequest): 
        Promise<GetQuestionsBySlugResponse> {
        const question = await this.questionsRepository.findBySlug(slug)

        if(!question) {
            return left(new ResourceNotFoundError())
        }

        return right({
            question
        })
    }
}