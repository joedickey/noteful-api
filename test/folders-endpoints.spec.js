const { expect } = require('chai')
require('dotenv').config()
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeFoldersArray } = require('./folders.fixtures')



describe('Folders Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

    describe('GET /api/folders', () => {
        context('Given no folders', () => {
            it('responds 200 and returns empty array', () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, [])
                    
            })
        })

        context('Given there are folders in database', () => {
            const testFolders = makeFoldersArray()

            beforeEach('insert folders', () => {
                return db  
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            it('responds with 200 and all folders', () => {
                return supertest(app)
                    .get('/api/folders/')
                    .expect(200, testFolders)
            })

        })
    })

    describe('GET /api/folders/:folder_id', () => {
        context('Given no folders', () => {
            it('responds 404', () => {
                const folderId = 12345
                return supertest(app)
                    .get(`/api/folders/${folderId}`)
                    .expect(404)
                    
            })
        })

        context('Given there are folders in database', () => {
            const testFolders = makeFoldersArray()

            beforeEach('insert folders', () => {
                return db  
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            it('responds with 200 and specified folder', () => {
                const folderId = 2
                return supertest(app)
                    .get(`/api/folders/${folderId}`)
                    .expect(200, testFolders[folderId -1]) 
            })

        })

    })

    describe('POST /api/folders', () => {
        it('creates an article and responds 201 with new article', () => {
            const newFolder = {
                name: 'new folder'
            }

            return supertest(app)
                .post('/api/folders')
                .send(newFolder)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newFolder.name)
                    expect(res.body).to.have.property('id')
                })
                .then(postRes => {
                    return supertest(app)
                        .get(`/api/folders/${postRes.body.id}`)
                        .expect(postRes.body)
                })

        })
    })

})