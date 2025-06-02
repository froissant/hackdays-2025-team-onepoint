import fastify from 'fastify'
import fileUpload from 'fastify-file-upload'

import 'dotenv/config'
import { IStorageService } from './services/IStorageService'
import { handleAssetUpload } from './workers/assetUploads'
import { localStorageService } from './services/localStorageService'

const server = fastify()
server.register(fileUpload)

const storageService: IStorageService = new localStorageService()

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

function getAssetObjectName(uploadId: string) {
	return `uploads/${uploadId.replace(/[^a-zA-Z0-9\_\-]+/g, '_')}`
}

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

