import { DepartmentNames } from "../models/departmentNames.model.js";   
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const createDepartment = asyncHandler(async (req, res) => {
    const { departmentName } = req.body;

    if (!departmentName) {
        throw new ApiError(400, "Department name is required");
    }

    if(departmentName.length < 2){
        throw new ApiError(201, "Department name should not less than 2 characters!")
    }

    const existingDepartment = await DepartmentNames.findOne({ departmentName });
    if (existingDepartment) {
        throw new ApiError(409, "Department already exists");
    }

    const newDepartment = await DepartmentNames.create({ departmentName });

    return res
        .status(201)
        .json(new ApiResponse(201, newDepartment, "Department created successfully"));
});

const getAllDepartments = asyncHandler(async (req, res) => {
    const departments = await DepartmentNames.find();
    if (!departments.length) {
        throw new ApiError(404, "No departments found");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, departments, "Departments fetched successfully"));
});

const getDepartmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid department ID");
    }

    const department = await DepartmentNames.findById(id);

    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, department, "Department fetched successfully"));
});

const deleteDepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid department ID");
    }

    const department = await DepartmentNames.findByIdAndDelete(id);

    if (!department) {
        throw new ApiError(404, "Department not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Department deleted successfully"));
});


export { 
    createDepartment, 
    getAllDepartments, 
    getDepartmentById, 
    deleteDepartment 
};
