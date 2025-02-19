import { Router } from "express";
import { getContactsController, getContactController, createContactController, patchContactController,deleteContactController } from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from "../db/models/contacts.js";
const router  = Router();
router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactController));
router.post('/contacts', validateBody(contactSchema), ctrlWrapper(createContactController));
router.patch('/contacts/:contactId',validateBody(contactSchema), isValidId, ctrlWrapper(patchContactController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;