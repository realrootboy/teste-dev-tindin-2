import * as mongoDB from 'mongodb';

import Place from './../models/places';

async function loadValidators(db: mongoDB.Db) {
    await db.command({
        collMod: process.env.PLACES_COLLECTION_NAME,
        validator: Place.validator()
    });
}

async function createCollections(db: mongoDB.Db) {
    const checkAndCreate = async (name: string) => {
        try {
            await db.createCollection(name);
        } catch (err) { }
    }

    await checkAndCreate(process.env.USERS_COLLECTION_NAME);
    await checkAndCreate(process.env.PLACES_COLLECTION_NAME);
}

export async function connectToDb() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    await createCollections(db);
    await loadValidators(db);

    const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME);
    const placesCollection: mongoDB.Collection = db.collection(process.env.PLACES_COLLECTION_NAME);


    collections.users = usersCollection;
    collections.places = placesCollection;

    return client;
}

export const collections: {
    users?: mongoDB.Collection,
    places?: mongoDB.Collection,
} = {};
