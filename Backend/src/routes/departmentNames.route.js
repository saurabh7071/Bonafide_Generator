import { Router } from "express"
import {
    createDepartment, 
    getAllDepartments, 
    getDepartmentById, 
    deleteDepartment 
} from "../controllers/departmentNames.controller.js"

const router = Router()

router.post("/create-department", createDepartment)
router.get("/get-all-departments", getAllDepartments)
router.get("/get-department-by-id/:id", getDepartmentById)
router.delete("/delete-department/:id", deleteDepartment)

export default router;