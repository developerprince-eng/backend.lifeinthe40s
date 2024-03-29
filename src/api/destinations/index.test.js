import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Destinations } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, destinations

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  destinations = await Destinations.create({})
})

test('POST /destinations 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, name: 'test', location: 'test', imgUrl: 'test', description: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.location).toEqual('test')
  expect(body.imgUrl).toEqual('test')
  expect(body.description).toEqual('test')
})

test('POST /destinations 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /destinations 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /destinations 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /destinations 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /destinations/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${destinations.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(destinations.id)
})

test('GET /destinations/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${destinations.id}`)
  expect(status).toBe(401)
})

test('GET /destinations/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /destinations/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${destinations.id}`)
    .send({ access_token: adminSession, name: 'test', location: 'test', imgUrl: 'test', description: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(destinations.id)
  expect(body.name).toEqual('test')
  expect(body.location).toEqual('test')
  expect(body.imgUrl).toEqual('test')
  expect(body.description).toEqual('test')
})

test('PUT /destinations/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${destinations.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /destinations/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${destinations.id}`)
  expect(status).toBe(401)
})

test('PUT /destinations/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, name: 'test', location: 'test', imgUrl: 'test', description: 'test' })
  expect(status).toBe(404)
})

test('DELETE /destinations/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${destinations.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /destinations/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${destinations.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /destinations/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${destinations.id}`)
  expect(status).toBe(401)
})

test('DELETE /destinations/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
