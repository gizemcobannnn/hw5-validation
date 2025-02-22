import createHttpError from "http-errors";
import { ROLES } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contacts.js";
export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;

    if (!user) {
      return next(createHttpError(401, 'Unauthorized'));
      
    }
    console.log("User Role:", user.role);  
    console.log("Params ContactId:", req.params.contactId); 


    const { role } = user;

    if (roles.includes(role) || role === ROLES.ADMIN) {
      return next();
    }

    if (roles.includes(ROLES.PARENT) && role === ROLES.PARENT) {
      const { contactId } = req.params;

      // Eğer spesifik bir contactId yoksa ve tüm contactlar isteniyorsa izin ver
      if (!contactId) {
        return next();
      }

      // Belirli bir contacta erişim kontrolü
      const contact = await ContactsCollection.findOne({
        _id: contactId,
        parentId: user._id,
      });

      if (contact) {
        return next();
      }

    }

    next(createHttpError(403, 'Forbidden'));
  };
