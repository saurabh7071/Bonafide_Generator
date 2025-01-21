import mongoose, { Schema } from "mongoose";

const departmentNamesSchema = new Schema({
    departmentName: {
        type: String,
        required: true
    }
},{ timestamps: true });

const DepartmentNames = mongoose.model("DepartmentNames", departmentNamesSchema);

export { DepartmentNames }
