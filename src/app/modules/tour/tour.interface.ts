import {Types} from "mongoose";





export interface TourTypeInterface {
    name: string;
}





export interface TourInterface {
    title: string;
    slug: string;
    description?: string;
    images?: string[];
    location?: string;
    costFrom?: number;
    departureLocation?: string;
    arrivalLocation?: string;
    startDate?: Date;
    endDate?: Date;
    included?: string[];
    excluded?: string[];
    amenities?: string[];
    tourPlan?: string[];
    maxGuests?: number;
    minAge?: number;
    division: Types.ObjectId;
    tourType: TourTypeInterface;
    createdAt?: Date;
}
