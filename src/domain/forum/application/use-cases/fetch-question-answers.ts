import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { Either, right } from "../../../../core/either";

interface FetchQuestionAnswersRequest {
    questionId: string
    page: number
}

type FetchQuestionAnswersResponse = Either< null, {
    answers: Answer[]
}>


export class FetchQuestionAnswersUseCase {
    constructor (
        private answerRepository: AnswerRepository
    ) {}

    async execute({ page, questionId }: FetchQuestionAnswersRequest): 
        Promise<FetchQuestionAnswersResponse> {
        const answers = await this.answerRepository.findManyByQuestionId(questionId, { page })

        return right({
            answers
        })
    }
}