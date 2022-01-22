import User from './../../src/models/users';
import { connectToDb, collections } from './../../src/services/database.service';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import request from 'supertest';

import Server from './../../src/server';
const app = (new Server()).app;
let client: MongoClient;
let token: string;

dotenv.config({
    path: '.env.test',
});

const originalEnv = process.env;

async function generateUser(): Promise<User> {
    const salt = await bcrypt.genSalt(8);
    const password_hash = await bcrypt.hash('123456', salt);

    const user = new User('renan', 'renangomes.es@gmail.com', password_hash);

    await collections.users.insertOne(user);
    return user;
}

describe('Unsplash', () => {
    beforeAll(async () => {
        client = await connectToDb();
        const user = await generateUser();
        const response = await request(app).post('/login').send({
            email: user.email,
            password: '123456',
        });
 
        token = response.body.token;
    });

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterAll(async () => {
        await collections.users.deleteMany({});
        await client.close();
    });

    it('should return a photo url when post a new place', async () => {
        const response = await request(app).post('/places')
            .set('Authorization', `Bearer ${token}`).send({
                name: 'Test',
            });

        expect(response.body).toHaveProperty('photo');
    });

    it('should not able to register a place when Unsplash Token is invalid', async () => {

        process.env.UNSPLASH_ACCESS_KEY = 'invalid_token';
        const response = await request(app).post('/places')
            .set('Authorization', `Bearer ${token}`).send({
                name: 'Test',
            });

        dotenv.config({
            path: '.env.test',
        });

        expect(response.status).toBe(401);
    });

    it('should not register a place when Unsplash not found a image', async () => {
        const response = await request(app).post('/places')
            .set('Authorization', `Bearer ${token}`).send({
                name: 'abcabc123abc123abc',
            });

        expect(response.status).toBe(404);
    });

    it('should update a place photo when changes the name', async () => {
        const response = await request(app).post('/places')
            .set('Authorization', `Bearer ${token}`).send({
                name: 'Test',
            });

        const place = response.body;

        const response2 = await request(app).put(`/places/${place.id}`)
            .set('Authorization', `Bearer ${token}`).send({
                name: 'mountain',
            });

        expect(response2.body.photo).not.toBe(place.photo);
    });

    it('should not update a place when name is the same', async () => {
        const response = await request(app).post('/places')
            .set('Authorization', `Bearer ${token}`).send({
                name: 'Test',
            });

        const place = response.body;

        const response2 = await request(app).put(`/places/${place.id}`)
            .set('Authorization', `Bearer ${token}`).send({
                name: 'Test',
            });

        expect(response2.body.photo).toBe(place.photo);
    });

    it('should not update a place when Unsplash not found a image', async () => {
        const response = await request(app).post('/places')
            .set('Authorization', `Bearer ${token}`).send({
                name: 'Test',
            });

        const place = response.body;

        const response2 = await request(app).put(`/places/${place.id}`)
            .set('Authorization', `Bearer ${token}`).send({
                name: 'abcabcabcabc123123',
            });

        expect(response2.status).toBe(404);
    });

});
