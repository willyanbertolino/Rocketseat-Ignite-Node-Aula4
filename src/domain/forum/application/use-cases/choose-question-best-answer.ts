import { Either, left, right } from "../../../../core/either";
import { Questions } from "../../enterprise/entities/questions";
import { AnswerRepository } from "../repositories/answer-repository";
import { QuestionsRepository } from "../repositories/question-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface ChooseQuestionsBestAnswereUseCaseRequest {
    authorId: string
    answerId: string
}

type ChooseQuestionsBestAnswereUseCaseResponse = Either< ResourceNotFoundError | NotAllowedError,  {
    question: Questions
}>

export class ChooseQuestionsBestAnswereUseCase {
    constructor (
        private questionsRepository: QuestionsRepository,
        private answerRepository: AnswerRepository
    ) {}

    async execute({ authorId, answerId}: ChooseQuestionsBestAnswereUseCaseRequest): 
        Promise<ChooseQuestionsBestAnswereUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if(!answer) {
            return left(new ResourceNotFoundError())
        }

        const question = await this.questionsRepository.findById(answer.questionId.toString())

        if(!question) {
            return left(new ResourceNotFoundError())
        }
        
        if(authorId !== question.authorId.toString()){
            return left(new NotAllowedError()) 
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)
        
        return right({
            question
        })
    }
}