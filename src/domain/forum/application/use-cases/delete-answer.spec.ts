import { expect, it, beforeEach, describe } from 'vitest'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from '../../../../../test/factories/make-answer'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '../../../../../test/factories/make-answer-attachment'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
    })

    it('should be able to delete a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswerRepository.create(newAnswer)

        inMemoryAnswerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            }),
        )

        await sut.execute({
            questionId: 'answer-1',
            authorId: 'author-1'
        })
        
        expect(inMemoryAnswerRepository.items).toHaveLength(0)
        expect(inMemoryAnswerRepository.items).toHaveLength(0)
        expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question from other user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))

        await inMemoryAnswerRepository.create(newAnswer)

        const result = await sut.execute({
            questionId: 'answer-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})