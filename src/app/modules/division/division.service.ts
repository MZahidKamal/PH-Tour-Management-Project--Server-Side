import DivisionModel from "./division.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import {generateDivisionSlugFunction} from "../../utils/generateDivisionSlugFunction";
import {generateDivisionThumbnailFunction} from "../../utils/generateDivisionThumbnailFunction";
import {consolePrint} from "../../utils/consolePrintFunction";





const createADivisionService = async (payload: any) => {

    // Destructuring the payload
    const {name, description} = payload;

    // First we'll check if we have this division already in the database'
    const isDivisionExist = await DivisionModel.findOne({name: name});
    if (isDivisionExist) {
        throw new AppError(httpStatus.CONFLICT, "Division already exists!");
    }

    // If the division is not exist, then create a new division object for the database'
    const newDivisionObj = {
        name: name,
        slug: generateDivisionSlugFunction(name),
        thumbnail: generateDivisionThumbnailFunction(name),
        description: description,
    }

    // Then save the new division object in the database'
    const newDivision = await DivisionModel.create(newDivisionObj);

    // Finally we'll return the newDivision
    return newDivision;
}





const getAllDivisionsService = async () => {

    // First we'll get all the divisions from the database'
    const allDivision = await DivisionModel.find({});

    // Then we'll get the total count of all the divisions from the database'
    const totalDivisionsCount = await DivisionModel.countDocuments({});

    // Finally we'll return the allDivision and the totalDivisionsCount'
    return {
        data: allDivision,
        meta: {
            total: totalDivisionsCount,
        }
    };
}





const getSingleDivisionService = async (payload: any) => {

    const slug = payload.params.slug as string;
    consolePrint(slug);

    // First we'll get all the divisions from the database'
    const singleDivision = await DivisionModel.findOne({slug: slug});

    // Then we'll check if we really have this division in the database'
    if (!singleDivision) {
        throw new AppError(httpStatus.NOT_FOUND, "Division not found!");
    }

    // If yes, then finally we'll return the singleDivision'
    return singleDivision;
}





const updateADivisionService = async (payload: any) => {

    // Destructuring the payload
    const divisionId = (payload.params.divisionId);
    const {name, description} = (payload.body);

    // First we'll check if we really have this division id in the database'
    const isDivisionIdExists = await DivisionModel.findById(divisionId);
    if (!isDivisionIdExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Division id not found!");
    }

    // Then we'll check if we have this division name already in the database'
    const isNewDivisionNameExists = await DivisionModel.findOne({
        name: name,
        _id: { $ne: divisionId }
    });
    if (isNewDivisionNameExists) {
        throw new AppError(httpStatus.CONFLICT, "Division name already exists!");
    }

    // Then we'll create a new division object for the database, with updated data'
    const updatedDivisionObj = {
        name: name? name : isDivisionIdExists.name,
        slug: name? generateDivisionSlugFunction(name) : isDivisionIdExists.slug,
        thumbnail: name? generateDivisionThumbnailFunction(name) : isDivisionIdExists.thumbnail,
        description: description? description : isDivisionIdExists.description,
    }

    // Then we'll update the division in the database'
    const updatedDivision = await DivisionModel.findByIdAndUpdate(divisionId, updatedDivisionObj, {new: true, runValidators: true});

    // Finally we'll return the updatedDivision'
    return updatedDivision;
}





const deleteADivisionService = async (payload: any) => {

    // Extracting the payload
    const divisionId = (payload.params.divisionId);

    // First we'll check if we really have this division id in the database'
    const isDivisionIdExists = await DivisionModel.findById(divisionId);
    if (!isDivisionIdExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Division id not found!");
    }

    // Then we'll delete the division from the database'
    await DivisionModel.findByIdAndDelete(divisionId);
    const deletedDivision = await DivisionModel.findById(divisionId);

    // Finally we'll return the deleted Division proof'
    return deletedDivision;
}





export const DivisionServices = {
    createADivisionService,
    getAllDivisionsService,
    getSingleDivisionService,
    updateADivisionService,
    deleteADivisionService,
}
