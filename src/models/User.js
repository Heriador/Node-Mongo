import pkg from 'mongoose';
import bycrypt from 'bcryptjs';

const { Schema, model } = pkg;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bycrypt.genSalt(15);
  const hash = await bycrypt.hash(password, salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (password) {
  return await bycrypt.compare(password, this.password);
};

export default model('User', UserSchema, 'Users');
