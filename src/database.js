import mongoose from 'mongoose';
import {config} from 'dotenv';
config()

console.log(process.env.MONGODB_URI)
export const db = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.error(err))