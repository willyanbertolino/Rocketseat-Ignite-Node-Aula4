import { expect, it, beforeEach, describe } from 'vitest'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
    })

    it('should be able to fetch question comments', async () => {
        await inMemoryQuestionCommentRepository.create(makeQuestionComment(
            {questionId: new UniqueEntityID('question-1')}
        ))
        await inMemoryQuestionCommentRepository.create(makeQuestionComment(
            {questionId: new UniqueEntityID('question-1')}
        ))
        await inMemoryQuestionCommentRepository.create(makeQuestionComment(
            {questionId: new UniqueEntityID('question-1')}
        ))

        const result = await sut.execute({
            questionId: 'question-1',
            page: 1
        })
        
        expect(result.value?.questionComments).toHaveLength(3)
    })

    it('should be able to fetch paginated question comment', async () => {
        for(let i = 1; i <= 22; i++) {
            await inMemoryQuestionCommentRepository.create(makeQuestionComment(
                {questionId: new UniqueEntityID('question-1')}
            ))
        }
        
        const result = await sut.execute({
            questionId: 'question-1',
            page: 2
        })
        
        expect(result.value?.questionComments).toHaveLength(2)
    })
})