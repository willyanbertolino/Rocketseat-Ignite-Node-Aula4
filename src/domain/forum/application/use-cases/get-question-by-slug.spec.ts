import { expect, it, beforeEach, describe } from 'vitest'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { GetQuestionsBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from '../../../../../test/factories/make-questions'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionsBySlugUseCase

describe('Get Questions By Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new GetQuestionsBySlugUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestion({slug: Slug.create('example-question')})

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            slug: 'example-question'
        })

        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title
            })
        })
    })

})