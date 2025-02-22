import mongoose from 'mongoose';
import { ROLES } from '../../constants/index.js';

const userSchema = new mongoose.Schema(  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: [ROLES.ADMIN, ROLES.PARENT],
        default: ROLES.PARENT,
      },
  },
  { timestamps: true, versionKey: false },);

  userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  };

const userCollection = mongoose.model('users', userSchema);

export default userCollection;