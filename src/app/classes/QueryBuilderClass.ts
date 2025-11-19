/* eslint-disable @typescript-eslint/no-explicit-any */
import {Model, Query} from "mongoose";


const defaultLimit = 10;
const defaultPage = 1;


interface QueryInterface {
    location?: string;
    searchTerm?: string;
    sort?: string;
    fields?: string;
    limit?: number | string;
    page?: number | string;
}


export class TourQueryBuilderClass<T> {
    public readonly model: Model<T>;
    public query: QueryInterface;
    public docs: Query<T[], T>;


    constructor(model: Model<T>, query: QueryInterface) {
        this.model = model;
        this.query = query;
        this.docs = this.model.find({})
    }


    filter() {
        const location = this.query.location ? this.query.location : '';
        const filterQuery = {
            location: {
                $regex: location,
                $options: 'i'
            }
        }
        this.docs = this.docs.find(filterQuery)
        return this;
    }


    search() {
        const searchTerm = this.query.searchTerm ? this.query.searchTerm : '';
        const searchQuery = {
            // title: { $regex: searchTerm, $options: 'i' },
            $or: [
                {title: {$regex: searchTerm, $options: 'i'}},
                {description: {$regex: searchTerm, $options: 'i'}},
                {location: {$regex: searchTerm, $options: 'i'}},
            ],
        }
        this.docs = this.docs.find(searchQuery)
        return this;
    }


    sort() {
        const sortTerm = this.query.sort ? this.query.sort : '-createdAt';
        this.docs = this.docs.sort(sortTerm)
        return this;
    }


    limit() {
        const limit = Number(this.query.limit ? this.query.limit : defaultLimit);
        this.docs = this.docs.limit(limit)
        return this;
    }


    skip(){
        const page = Number(this.query.page ? this.query.page : defaultPage);
        const limit = Number(this.query.limit ? this.query.limit : defaultLimit);
        const skipQuery = (page - 1) * limit;
        this.docs = this.docs.skip(skipQuery)
        return this;
    }


    fields(){
        const fields = this.query.fields ? this.query.fields : '';
        const fieldsQuery  = fields.split(',').join(' ');
        this.docs = this.docs.select(fieldsQuery);
        return this;
    }


    paginate(){
        const page = Number(this.query.page ? this.query.page : defaultPage);
        const limit = Number(this.query.limit ? this.query.limit : defaultLimit);
        const skipQuery = (page - 1) * limit;
        this.docs = this.docs.skip(skipQuery).limit(limit);
        return this;
    }


    build(){
        this.docs.populate({path: 'division', select: '-_id name'})
        this.docs.populate({path: 'tourType', select: '-_id name'})
        return this.docs.lean().exec();
    }

    async meta() {
        const limit: number = Math.max(1, Number(this.query.limit ?? defaultLimit));                            // ?? হলো nullish coalescing—বাম দিকের ভ্যালু null বা undefined হলে ডান দিকটা নেয়।
        const page: number  = Math.max(1, Number(this.query.page  ?? defaultPage));                             // limit and page should never be less than 1.

        const filter: any = this.docs.getFilter();
        const totalToursCount: number = await this.model.countDocuments(filter);
        const totalPages: number = Math.max(1, Math.ceil(totalToursCount / limit));

        return {
            total: totalToursCount,
            totalPages,
            currentPage: page,
            limit
        };
    }
}










/*
`.lean()` দিলে Mongoose ডকুমেন্ট **hydrate** না করে **plain JS object** রিটার্ন করে।
**ফায়দা:**    অনেক **ফাস্ট** ও কম মেমোরি—read-only API গুলোর জন্য দারুণ।
**লস:**      ডকুমেন্ট মেথড/চেঞ্জ-ট্র্যাকিং নেই (`doc.save()`, getters/setters, virtuals ইত্যাদি কাজ করবে না)।
*/
