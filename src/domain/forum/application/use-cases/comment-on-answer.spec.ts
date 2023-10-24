import { expect, it, beforeEach, describe } from 'vitest'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentRepository } from '../../../../../test/repositories/in-memory-answer-comment-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Question', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
        sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentRepository)
    })

    it('should be able to comment on answer', async () => {
        const answer = makeAnswer()

        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: answer.authorId.toString(),
            content: 'Comentário teste'
        })
        
        expect(inMemoryAnswerCommentRepository.items[0].content).toEqual('Comentário teste')
    })
})