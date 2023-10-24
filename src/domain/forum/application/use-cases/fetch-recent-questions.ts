import { Either, right } from "../../../../core/either";
import { Questions } from "../../enterprise/entities/questions";
import { QuestionsRepository } from "../repositories/question-repository";

interface FetchRecentQuestionsRequest {
    page: number
}

type FetchRecentQuestionsResponse = Either< null, {
    questions: Questions[]
}>


export class FetchRecentQuestionsUseCase {
    constructor (
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ page }: FetchRecentQuestionsRequest): 
        Promise<FetchRecentQuestionsResponse> {
        const questions = await this.questionsRepository.findManyRecent({page})

        return right({
            questions
        })
    }
}