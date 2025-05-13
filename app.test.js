const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, Todo } = require('./app.js');
const connectDB = require('./db.js');
require('dotenv').config({ path: ".env.test" })


const { expect } = chai;
chai.use(chaiHttp);

describe('Todo API Tests', () => {
    before(async function () {
        this.timeout(10000);

        if (mongoose.connection.readyState === 0) {
            console.log("Connecting to MongoDB for tests...");
            await connectDB(process.env.TEST_MONGO_URI)
        } else {
            console.log("Already connected to MongoDB, skipping new connection.");
        }
    });


    after(async () => {
        await mongoose.connection.close();
    });

    let todoId;

    it('should create a new todo', (done) => {
        chai.request(app)
            .post('/todo')
            .send({ title: 'Test Todo', description: 'Test Description', status: 'pending' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Test Todo');
                todoId = res.body._id;
                done();
            });
    });

    it('should fetch all todos', (done) => {
        chai.request(app)
            .get('/todos')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should fetch a single todo by ID', (done) => {
        chai.request(app)
            .get(`/todo/${todoId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Test Todo');
                done();
            });
    });

    it('should update a todo', (done) => {
        chai.request(app)
            .put(`/todo/${todoId}`)
            .send({ status: 'completed' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('status', 'completed');
                done();
            });
    });

    it('should delete a todo', (done) => {
        chai.request(app)
            .delete(`/todo/${todoId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Todo deleted successfully');
                done();
            });
    });

    it('should return an error when creating a todo without a title', (done) => {
        chai.request(app)
            .post('/todo')
            .send({ description: 'Missing Title' }) // No title provided
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                done();
            });
    });

    it('should return an error when fetching a non-existent todo', (done) => {
        chai.request(app)
            .get('/todo/65fabc1234567890abcdef12') // Non-existent ID
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message', 'Todo not found');
                done();
            });
    });

    it('should return an error when updating a non-existent todo', (done) => {
        chai.request(app)
            .put('/todo/65fabc1234567890abcdef12') // Non-existent ID
            .send({ status: 'completed' })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message', 'Todo not found');
                done();
            });
    });

    it('should return an error when deleting a non-existent todo', (done) => {
        chai.request(app)
            .delete('/todo/65fabc1234567890abcdef12') // Non-existent ID
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message', 'Todo not found');
                done();
            });
    });

    it('should return 500 if MongoDB is not connected', (done) => {
        mongoose.disconnect().then(() => {
            chai.request(app)
                .get('/todos')
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    mongoose.connect(process.env.TEST_MONGO_URI, {
                        user: process.env.MONGO_USERNAME,
                        pass: process.env.MONGO_PASSWORD
                    }).then(() => done());
                });
        });
    });

    describe('it should fetch Live Status', () => {
        it('it checks Liveness endpoint', (done) => {
            chai.request(app)
                .get('/live')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('status', 'live');
                    done();
                });
        });
    });

    describe('it should fetch Ready Status', () => {
        it('it checks Readiness endpoint', (done) => {
            chai.request(app)
                .get('/ready')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('status', 'ready');
                    done();
                });
        });
    });
});
