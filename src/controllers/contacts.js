//server.jsdki controllerkoduburaya tasinvak
import createHttpError from "http-errors";
import { updateContact,deleteContact, getContactById, getAllContacts, createContact } from "../services/contacts.js"
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { env } from "../utils/env.js";
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
    let photoUrl = '';
    const photo = req.file;
    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
          photoUrl = await saveFileToCloudinary(photo);
        } else {
          photoUrl = await saveFileToUploadDir(photo);
        }
      }

    const newUser = { ...req.body, photoUrl, userId: req.user._id };
    const contact = await createContact(newUser);
    
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    })
}catch(e){
    next(createHttpError(500, e.message));

}

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
    try{
        const { contactId } = req.params;
        const photo = req.file;
        const userId = req.user._id;
        let photoUrl;
      
        if (photo) {
          if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
          } else {
            photoUrl = await saveFileToUploadDir(photo);
          }
        }
        const result = await updateContact(contactId, userId, {
          ...req.body,
          photoUrl,
        });
      
        if (!result) {
          next(createHttpError(404, 'Contact not found'));
          return;
        }
      
        res.json({
          status: 200,
          url:photoUrl,
          message: `Successfully patched a contact!`,
          data: result.contact,
        });
    }catch(error){
        console.log(error.message)
        next(error);
    }

  };

