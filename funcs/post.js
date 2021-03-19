require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://mende:ylMMxDKhPlsxGr99@fccmongoosecluster.iouh8.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const getPosts = async () => {

    await client.connect();

    const db = client.db('post-public');
    const collection = db.collection('posts');

    const res = await collection.find({}).toArray();

    // await client.close();

    return res;

}

const addPost = async (content) => {

    await client.connect();

    const db = client.db('post-public');
    const collection = db.collection('posts');

    const res = await collection.insert({
        content: content,
        postDate: new Date().toLocaleString()
    });

    // await client.close();

    return res;
};

exports.handler = async (event, context) => {

    let res = {};

    switch (event.httpMethod) {
        case 'GET':
            res = await getPosts();
            break;
        case 'POST':
            const params = JSON.parse(event.body);
            const content = params.content || "empty";
            res = await addPost(content);
            break;
    }

    console.log('res', res);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res)
    }
}
