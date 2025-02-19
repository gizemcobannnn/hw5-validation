import { ContactsCollection } from '../db/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = '_id', filter }) => {
  const limit = Math.max(1, perPage); 
  const skip = Math.max(0, (page - 1) * limit);
  const order = sortOrder === SORT_ORDER.DESC ? -1 : 1;

  const filterQuery = Object.fromEntries(
    // eslint-disable-next-line no-unused-vars
    Object.entries(filter).filter(([_, value]) => value !== null)
  ); 

  const contactsCount = await ContactsCollection.countDocuments(filterQuery);
  const contacts = await ContactsCollection.find(filterQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: order });

  const paginationData = calculatePaginationData(contactsCount, page, limit);

  return {
      data: contacts,
      ...paginationData
  };
};


export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact; 
};

export const createContact = async(payload)=>{
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async(contactId,payload,options)  => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete({ _id: contactId });
  return contact;
};