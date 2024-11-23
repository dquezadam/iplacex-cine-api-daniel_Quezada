import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = 'mongodb+srv://dquezadam:Iplacex2024@cluster-proyecyo-ejempl.z7d8q.mongodb.net/?retryWrites=true&w=majority&appName=cluster-proyecyo-ejemplo'

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export default client