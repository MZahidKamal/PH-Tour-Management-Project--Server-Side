import {consolePrint} from "../../utils/consolePrintFunction";
import {TourModel, TourTypeModel} from "./tour.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import {TourTypeInterface} from "./tour.interface";
import {TourQueryBuilderClass} from "../../classes/QueryBuilderClass";
import {deleteAnImageFromCloudinary} from "../../config/cloudinary.config";





/*============================== Tour Type Services ==============================*/

const createATourTypeService = async (payload: TourTypeInterface) => {

    // First, we'll destructure the payload
    const {name: tourName} = payload

    // Then, we'll check if we have this tour type already in the database
    const isTourTypeExist = await TourTypeModel.findOne({name: tourName});
    if (isTourTypeExist !== null) {
        throw new AppError(httpStatus.CONFLICT, "Tour type already exists!");
    }

    // If the tour type is not exist, then create a new tour type in the database
    const newTourType = await TourTypeModel.create(payload);

    // Finally, we'll return the newTourType
    return newTourType
};



const getAllTourTypesService = async () => {

    // First, we'll get all the tour types from the database
    const allTourTypes = await TourTypeModel.find({});
    const totalTourTypesCount = await TourTypeModel.countDocuments({});


    // Then, we'll return the allTourTypes and the totalTourTypesCount
    return {
        data: allTourTypes,
        meta: {
            total: totalTourTypesCount
        }
    }
};



/* eslint-disable @typescript-eslint/no-explicit-any */
const updateATourTypeService = async (payload: any) => {
    // First, we'll destructure the payload
    const tourTypeId = payload.params.tourTypeId
    const updatedTourType = payload.body

    // Then we'll check if we really have this tour type id in the database
    const isTourTypeIdExists = await TourTypeModel.findById(tourTypeId);
    if (!isTourTypeIdExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Tour type id not found!");
    }

    // Then we'll check if we have this tour type name already in the database
    const isNewTourTypeNameExists = await TourTypeModel.findOne({
        name: updatedTourType.name,
        _id: { $ne: tourTypeId }
    });
    if (isNewTourTypeNameExists) {
        throw new AppError(httpStatus.CONFLICT, "Tour type name already exists!");
    }

    // Then we'll update the tour type in the database
    const updatedTourTypeObj = await TourTypeModel.findByIdAndUpdate(tourTypeId, updatedTourType, {new: true, runValidators: true});

    // Finally, we'll return the updatedTourTypeObj
    return updatedTourTypeObj
}



/* eslint-disable @typescript-eslint/no-explicit-any */
const deleteATourTypeService = async (payload: any) => {
    // First, we'll extract the tour type id from the payload
    const tourTypeId = payload.params.tourTypeId

    // Then we'll check if we really have this tour type id in the database
    const isTourTypeIdExists = await TourTypeModel.findById(tourTypeId);
    if (!isTourTypeIdExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Tour type id not found!");
    }

    // Then we'll delete the tour type from the database
    await TourTypeModel.findByIdAndDelete(tourTypeId);
    const deletedTourType = await TourTypeModel.findById(tourTypeId);

    // Finally, we'll return the deleted tour type
    return deletedTourType
}





/*============================== Tour Services ==============================*/

/* eslint-disable @typescript-eslint/no-explicit-any */
const createATourService = async (payload: any) => {

    // First, we'll extract the tour data from the payload.body and the tour images from the payload.files'
    const tourObj = payload.body;
    const tourImages = payload.files.map((file: Express.Multer.File) => {
        return file.path;
    });

    // Then, we'll check if we have the tour title already in the database'
    const isTourTitleExist = await TourModel.findOne({title: tourObj?.title});
    if (isTourTitleExist !== null) {
        throw new AppError(httpStatus.CONFLICT, "Tour title already exists!");
    }

    // If the tour title is not exist, then create a new tour object for the database'
    const newTourObj = {
        title: tourObj?.title,
        slug: tourObj?.title.toLowerCase().split(' ').join('-').concat('-tour-in-' + tourObj?.location.toLowerCase().split(' ').join('-')),
        description: tourObj?.description,
        images: tourImages,
        location: tourObj?.location,
        costFrom: tourObj?.costFrom,
        departureLocation: tourObj?.departureLocation,
        arrivalLocation: tourObj?.arrivalLocation,
        startDate: tourObj?.startDate,
        endDate: tourObj?.endDate,
        included: tourObj?.included,
        excluded: tourObj?.excluded,
        amenities: tourObj?.amenities,
        tourPlan: tourObj?.tourPlan,
        maxGuests: tourObj?.maxGuests,
        minAge: tourObj?.minAge,
        division: tourObj?.division,
        tourType: tourObj?.tourType,
    }

    // Then we'll save the new tour object in the database'
    const newTour = await TourModel.create(newTourObj);

    // Finally we'll return the newTour
    return newTour
}



/*const getAllToursService = async (payload: any) => {

    // Extracting the query parameters from the payload
    // const {location, searchTerm} = payload.query
    const location = payload.query.location ? payload.query.location : '';
    const searchTerm = payload.query.searchTerm ? payload.query.searchTerm : '';
    const sortTerm = payload.query.sort ? payload.query.sort : '-createdAt';
    const fields = payload.query.fields ? payload.query.fields : '';
    const limit = Number(payload.query.limit ? payload.query.limit : 5);
    const page = Number(payload.query.page ? payload.query.page : 1);

    const filterQuery = {
        location: { $regex: location, $options: 'i' }
    }

    /!*const searchQuery = {
        // title: { $regex: searchTerm, $options: 'i' },
        $or: [
            {title:         {$regex: searchTerm, $options: 'i'}},
            {description:   {$regex: searchTerm, $options: 'i'}},
            {location:      {$regex: searchTerm, $options: 'i'}},
        ],
    }*!/

    const searchFields = ['title', 'description', 'location']
    const searchQuery = {
        $or: searchFields.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' }
        })),
    };

    const fieldsQuery  = fields.split(',').join(' ')

    const skipQuery = (page - 1) * limit;

    // We'll fetch all the tour documents from the database along with the count of all the tours
    const allTours = await TourModel
        .find(filterQuery)
        .find(searchQuery)
        .sort(sortTerm)
        .limit(limit)
        .skip(skipQuery)
        .select(fieldsQuery)                                        // Field filtering
        .populate({path: 'division', select: '-_id name'})
        .populate({path: 'tourType', select: '-_id name'});


    // const totalToursCount = await TourModel.countDocuments({});
    const totalToursCount = allTours.length;

    // Then we'll return the allTours and the totalToursCount'
    return {
        meta: {
            total: totalToursCount,
            totalPages: Math.ceil(totalToursCount / limit),
            currentPage: page,
            limit,
        },
        data: allTours
    };
}*/
/*const getAllToursService = async (payload: any) => {

    const queryBuilder = new TourQueryBuilderClass(TourModel, payload.query)
    const allTours = await queryBuilder
        .filter()
        .search()
        .sort()
        .limit()
        .skip()
        .fields()
        .paginate()                     //TODO: Aren't we applying limit and skip twice? Check very carefully.
        .build();

    const toursMeta = await queryBuilder.meta();

    // Then we'll return the allTours and the totalToursCount'
    return {
        meta2: toursMeta,
        data: allTours
    };
}*/
/* eslint-disable @typescript-eslint/no-explicit-any */
const getAllToursService = async (payload: any) => {

    const queryBuilder = new TourQueryBuilderClass(TourModel, payload.query)
    const allToursMethodChain = queryBuilder
        .filter()
        .search()
        .sort()
        .limit()
        .skip()
        .fields()
        .paginate();                     //TODO: Aren't we applying limit and skip twice? Check very carefully.

    const allToursPromises = await Promise.all([
        allToursMethodChain.build(),
        allToursMethodChain.meta()
    ]);

    // Then we'll return the allTours and the totalToursCount'
    return {
        data: allToursPromises[0],
        meta: allToursPromises[1]
    };
}
// The same function, 1st version, which is commented out, is not using the query builder class.
// The 2nd version, which is commented out, is using the query builder class.
// The 3rd version, which is active, is using the query builder class with method chain sequence and promises maintained properly.



/* eslint-disable @typescript-eslint/no-explicit-any */
const getSingleTourService = async (payload: any) => {

    // First, we'll extract the tour slug from the payload'
    const slug = payload.params.slug;
    consolePrint(slug);

    // Then we'll check if we really have this tour slug in the database'
    const tourDocument = await TourModel.findOne({slug: slug})

    // If the tour document is not found, then throw an error'
    if (!tourDocument) {
        throw new AppError(httpStatus.NOT_FOUND, "Tour not found!");
    }

    // Then we'll return the tour document'
    return tourDocument;
}



/* eslint-disable @typescript-eslint/no-explicit-any */
const updateATourService = async (payload: any) => {

    // First, we'll extract the tour id from params, the updated tour data from the payload.body and the updated tour images from the payload.files'
    const tourId = payload.params.tourId;
    const updatedTourData = payload.body;
    const updatedTourImages = payload.files?.map((file: Express.Multer.File) => {
        return file.path;
    }) || [];

    // Then we'll check if we really have this tour id in the database
    const isTourIdExists = await TourModel.findById(tourId);
    if (!isTourIdExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Tour id not found!");
    }

    // Then we'll check if we have this tour title already in the database
    const isNewTourTitleExists = await TourModel.findOne({
        title: updatedTourData.title,
        _id: { $ne: tourId }
    });
    if (isNewTourTitleExists) {
        throw new AppError(httpStatus.CONFLICT, "Tour title already exists!");
    }

    // Then we'll create a updated tour object for the database, with updated data
    const updatedTourObj = {
        title: updatedTourData.title? updatedTourData.title : isTourIdExists.title,
        slug: updatedTourData.title? updatedTourData.title?.toLowerCase().split(' ').join('-').concat('-tour-in-' + (updatedTourData.location || isTourIdExists.location)?.toLowerCase().split(' ').join('-')) : isTourIdExists.slug,
        description: updatedTourData.description? updatedTourData.description : isTourIdExists.description,
        images: updatedTourImages.length > 0
            ? [...(isTourIdExists.images || []).filter((img: string) => !updatedTourData.deleteImages?.includes(img)), ...updatedTourImages]
            : (isTourIdExists.images || []).filter((img: string) => !updatedTourData.deleteImages?.includes(img)),
        location: updatedTourData.location? updatedTourData.location : isTourIdExists.location,
        costFrom: updatedTourData.costFrom? updatedTourData.costFrom : isTourIdExists.costFrom,
        startDate: updatedTourData.startDate? updatedTourData.startDate : isTourIdExists.startDate,
        endDate: updatedTourData.endDate? updatedTourData.endDate : isTourIdExists.endDate,
        included: updatedTourData.included? updatedTourData.included : isTourIdExists.included,
        excluded: updatedTourData.excluded? updatedTourData.excluded : isTourIdExists.excluded,
        amenities: updatedTourData.amenities? updatedTourData.amenities : isTourIdExists.amenities,
        tourPlan: updatedTourData.tourPlan? updatedTourData.tourPlan : isTourIdExists.tourPlan,
        maxGuests: updatedTourData.maxGuests? updatedTourData.maxGuests : isTourIdExists.maxGuests,
        minAge: updatedTourData.minAge? updatedTourData.minAge : isTourIdExists.minAge,
        division: updatedTourData.division? updatedTourData.division : isTourIdExists.division,
        tourType: updatedTourData.tourType? updatedTourData.tourType : isTourIdExists.tourType,
    }

    // Then we'll update the tour in the database
    const updatedTour = await TourModel.findByIdAndUpdate(tourId, updatedTourObj, {new: true, runValidators: true});

    // If the tour images are provided in the payload, then we'll delete the old tour images from the server'
    if (updatedTourData.deleteImages && updatedTourData.deleteImages.length > 0) {
        await Promise.all(
            updatedTourData.deleteImages.map((imageUrl: string) => {
                return deleteAnImageFromCloudinary(imageUrl);
            })
        )
    }

    // Finally, we'll return the updatedTour
    return updatedTour
}



/* eslint-disable @typescript-eslint/no-explicit-any */
const deleteATourService = async (payload: any) => {

    // First, we'll extract the tour id from the payload
    const tourId = payload.params.tourId;

    // Then we'll check if we really have this tour id in the database
    const isTourIdExists = await TourModel.findById(tourId);
    if (!isTourIdExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Tour id not found!");
    }

    // Then we'll delete the tour from the database
    await TourModel.findByIdAndDelete(tourId);
    const deletedTour = await TourModel.findById(tourId);

    // Finally we'll return the deleted tour proof
    return deletedTour
}





export const TourService = {
    createATourTypeService,
    getAllTourTypesService,
    updateATourTypeService,
    deleteATourTypeService,

    createATourService,
    getAllToursService,
    getSingleTourService,
    updateATourService,
    deleteATourService
};
