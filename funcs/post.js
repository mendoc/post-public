require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const uri = process.env.MONGO_URI;

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
        postDate: Date.now()
    });

    // await client.close();

    return res;
};

const deletePost = async (id) => {

    await client.connect();

    const db = client.db('post-public');
    const collection = db.collection('posts');

    const res = await collection.findOneAndDelete({
        _id: ObjectId(id),
    });

    // await client.close();

    return res;
};

exports.handler = async (event, context) => {

    let res = {};
    let params = {};

    switch (event.httpMethod) {
        case 'GET':
            res = await getPosts();
            break;
        case 'POST':
            params = JSON.parse(event.body);
            if (params.mode && params.mode === "delete") {
                const id = params.id || 0;
                res = await deletePost(id);
            } else {
                const content = params.content || "empty";
                res = await addPost(content);
            }
            break;
    }

    console.log('res', res);

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(res)
    }
}
