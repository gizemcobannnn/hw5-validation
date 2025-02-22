
import { Schema, model, mongoose} from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isFavourite: {
        type: Boolean,
        required: true,
      },
    contactType: {
        type: String,
        required: true,
        enum: ['personal', 'home', 'other'],
    },
    parentId: { type: Schema.Types.ObjectId, ref: 'users' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 

  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ContactsCollection = model('contacts', contactsSchema);

