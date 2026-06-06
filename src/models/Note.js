import { Schema, model } from '../helpers/mongoose.js';

const NotesSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    user: {
        type: String,
        require: true
    }
},{
    timestamps: true
});

export default model('Note', NotesSchema,'Notes')
