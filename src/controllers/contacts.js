//server.jsdki controllerkoduburaya tasinvak
import createHttpError from "http-errors";
import { createContact,updateContact,deleteContact, getContactById, getAllContacts } from "../services/contacts.js"
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
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
    
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId} !`,
            data:contact
        });
    
        if(!contact){
            next(createHttpError(404, "Contact not found"));
            res.status(404).json(
                {
                    status: 404,
                    message: "Contact not found"
                }
            );
            return;
        }
    }catch(error){
        res.status(500).json({
            status:500,
            data: error.message,
            message:"server error",
        })
    }


};

export const createContactController = async(req,res)=>{
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    })
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
