import { expect, it, beforeEach, describe } from 'vitest'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { makeQuestion } from '../../../../../test/factories/make-questions'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository'
import { CommentOnQuestionsUseCase } from './comment-on-question'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionsUseCase

describe('Comment on Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
        sut = new CommentOnQuestionsUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentRepository)
    })
    it('should be able to comment on question', async () => {
        const question = makeQuestion()

        await inMemoryQuestionsRepository.create(question)

        await sut.execute({
            questionId: question.id.toString(),
            authorId: question.authorId.toString(),
            content: 'Comentário teste'
        })
        
        expect(inMemoryQuestionCommentRepository.items[0].content).toEqual('Comentário teste')
    })
})