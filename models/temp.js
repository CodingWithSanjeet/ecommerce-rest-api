import { MongoClient } from 'mongodb';
import {
  ObjectId
} from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'product': new ObjectId('687666f92cc0d50987c8079c')
    }
  }, {
    '$group': {
      '_id': '$product',  
      'numOfRatings': {
        '$sum': 1
      }, 
      'averageRating': {
        '$avg': '$rating'
      }
    }
  }
];

const client = await MongoClient.connect(
  ''
);
const coll = client.db('ecom-api').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();