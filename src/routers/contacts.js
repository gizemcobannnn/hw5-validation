import { Router } from "express";
import { getContactsController, getContactController, createContactController, patchContactController,deleteContactController } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from "../validation/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkRoles } from "../middlewares/checkRoles.js";
import { ROLES } from "../constants/index.js";

const router  = Router();
router.use(authenticate);
router.get('/contacts', checkRoles(ROLES.ADMIN),ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', checkRoles(ROLES.ADMIN,ROLES.PARENT), isValidId, ctrlWrapper(getContactController));
router.post('/contacts', checkRoles(ROLES.ADMIN), validateBody(contactSchema), ctrlWrapper(createContactController));
router.patch('/contacts/:contactId',checkRoles(ROLES.ADMIN,ROLES.PARENT), validateBody(contactSchema), isValidId, ctrlWrapper(patchContactController));
router.delete('/contacts/:contactId',  checkRoles(ROLES.ADMIN),isValidId, ctrlWrapper(deleteContactController));

export default router;