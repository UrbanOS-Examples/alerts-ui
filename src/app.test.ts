import app from './app';
import supertest from 'supertest';

describe('GET - Healthcheck', () => {
    it('Returns healthy', async () => {
        const res = await supertest(app).get('/healthcheck');
        expect(res.text).toEqual('Healthy');
        expect(res.statusCode).toEqual(200);
    });
});
