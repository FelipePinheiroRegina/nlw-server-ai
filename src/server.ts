import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { createQuestion } from './http/routes/create-question.ts'
import { createRoom } from './http/routes/create-room.ts'
import { getRoomQuestions } from './http/routes/get-room-questions.ts'
import { getRooms } from './http/routes/get-rooms.ts'
import { uploadAudio } from './http/routes/upload-audio.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyMultipart)

app.register(fastifyCors, {
  origin: '*',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {
  return 'OK'
})

app.register(getRooms)
app.register(createRoom)
app.register(getRoomQuestions)
app.register(createQuestion)
app.register(uploadAudio)

app.listen({ port: env.PORT })
