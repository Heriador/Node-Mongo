const {Schema, model} = require('mongoose');
const bycrypt=require('bcryptjs');

const UserSchema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true}
}, {
    timestamps:true
});

UserSchema.methods.encryptPassword = async password =>{
    const salt = await bycrypt.genSalt(15);
    return hash = await bycrypt.hash(password,salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bycrypt.compare(password, this.password)
}

module.exports = model('User', UserSchema, 'Users');