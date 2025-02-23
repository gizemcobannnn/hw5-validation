//server.jsdki controllerkoduburaya tasinvak
import createHttpError from "http-errors";
import { updateContact,deleteContact, getContactById, getAllContacts } from "../services/contacts.js"
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { ContactsCollection } from "../db/models/contacts.js";
import mongoose from "mongoose";
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';



export const getContactsController = async(req,res)=>{
    
    try{
        const {page, perPage} = parsePaginationParams(req.query);
        const {sortBy, sortOrder} = parseSortParams(req.query);
        const filter = parseFilterParams(req.query);

        const { data, totalItems, totalPages, hasPreviousPage, hasNextPage } = await getAllContacts({ 
            page, 
            perPage, 
            sortBy, 
            sortOrder, 
            filter 
        });

        const message = totalItems === 0 ?  "No contact for this search" :"Successfully found contacts!";
    
        res.status(200).json({
            status: 200,

            message: message,
            data,
            pagination: {
                page,
                perPage,
                totalItems,
                totalPages,
                hasPreviousPage,
                hasNextPage,
            },
     });
    }catch(error){
        res.status(500).json({
            status: 500,
            message: "server error !",
            data: error.message,
        });
    }

};


export const getContactController = async(req,res,next)=>{
    
    try{
        const {contactId} = req.params;
        const contact = await getContactById(contactId);
        if(!contact){
            return next(createHttpError(404, "Contact not found"));
    
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId} !`,
            data:contact
        });
        
    }catch(error){
        res.status(500).json({
            status:500,
            message:error.message
        })
    }


};

export const createContactController = async(req,res,next)=>{

try{
    const { name, phoneNumber, email, isFavourite, contactType, userId, parentId } = req.body;

    const newContact = new ContactsCollection({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: new mongoose.Types.ObjectId(userId),
      parentId: new mongoose.Types.ObjectId(parentId),
    });

    await newContact.save();
    
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact,
    })
}catch(e){
    next(createHttpError(500, e.message));

}

}

export const patchContactController  = async(req,res,next)=>{
    const {contactId} = req.params;
    const result = await updateContact(contactId, req.body);

    if(!result){
        next(createHttpError(404,"Not found"));
        return;
    }

    res.status(200).json({
        status: 200,
	    message: "Successfully patched a contact!",
	    data: result.contact,
    })
}


export const deleteContactController = async(req,res,next)=>{
    const { contactId } = req.params;

    const deletedContact = await deleteContact(contactId);
    
    if(!deletedContact){
        next(createHttpError(404,"Not found"))
        return;
    }
    res.status(204).json({
        status:204,
        message: "deleted",
        data: deletedContact,
    })
    
}

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const photo = req.file;
  
    let photoUrl;
  
    if (photo) {
      photoUrl = await saveFileToUploadDir(photo);
    }
  
    const result = await updateContact(contactId, {
      ...req.body,
      photo: photoUrl,
    });
  
    if (!result) {
      next(createHttpError(404, 'Student not found'));
      return;
    }
  
    res.json({
      status: 200,
      message: `Successfully patched a student!`,
      data: result.student,
    });
  };

  // src/controllers/students.js



export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateStudent(studentId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};
