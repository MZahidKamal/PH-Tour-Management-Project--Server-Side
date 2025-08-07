import {model, Schema} from "mongoose";
import {DivisionInterface} from "./division.interface";





const divisionSchema = new Schema<DivisionInterface>({
        name: {
            type: String,
            required: [true, "Division name is required!"],
            unique: [true, "Division name already exists!"],
            minlength: [3, "Division name must be at least 3 characters long!"],
            maxlength: [20, "Division name must be at most 100 characters long!"],
            trim: true,
        },
        slug: {
            type: String,
            unique: [true, "Division slug already exists!"]
        },
        thumbnail: {
            type: String,
        },
        description: {
            type: String,
            minlength: [10, "Description must be at least 10 characters long!"],
            maxlength: [100, "Description must be at most 100 characters long!"],
            trim: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    })





export const DivisionModel = model<DivisionInterface>('DivisionModel', divisionSchema);





export default DivisionModel;
