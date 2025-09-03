"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourQueryBuilderClass = void 0;
const defaultLimit = 10;
const defaultPage = 1;
class TourQueryBuilderClass {
    constructor(model, query) {
        this.model = model;
        this.query = query;
        this.docs = this.model.find({});
    }
    filter() {
        const location = this.query.location ? this.query.location : '';
        const filterQuery = {
            location: {
                $regex: location,
                $options: 'i'
            }
        };
        this.docs = this.docs.find(filterQuery);
        return this;
    }
    search() {
        const searchTerm = this.query.searchTerm ? this.query.searchTerm : '';
        const searchQuery = {
            // title: { $regex: searchTerm, $options: 'i' },
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } },
            ],
        };
        this.docs = this.docs.find(searchQuery);
        return this;
    }
    sort() {
        const sortTerm = this.query.sort ? this.query.sort : '-createdAt';
        this.docs = this.docs.sort(sortTerm);
        return this;
    }
    limit() {
        const limit = Number(this.query.limit ? this.query.limit : defaultLimit);
        this.docs = this.docs.limit(limit);
        return this;
    }
    skip() {
        const page = Number(this.query.page ? this.query.page : defaultPage);
        const limit = Number(this.query.limit ? this.query.limit : defaultLimit);
        const skipQuery = (page - 1) * limit;
        this.docs = this.docs.skip(skipQuery);
        return this;
    }
    fields() {
        const fields = this.query.fields ? this.query.fields : '';
        const fieldsQuery = fields.split(',').join(' ');
        this.docs = this.docs.select(fieldsQuery);
        return this;
    }
    paginate() {
        const page = Number(this.query.page ? this.query.page : defaultPage);
        const limit = Number(this.query.limit ? this.query.limit : defaultLimit);
        const skipQuery = (page - 1) * limit;
        this.docs = this.docs.skip(skipQuery).limit(limit);
        return this;
    }
    build() {
        this.docs.populate({ path: 'division', select: '-_id name' });
        this.docs.populate({ path: 'tourType', select: '-_id name' });
        return this.docs.lean().exec();
    }
    meta() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const limit = Math.max(1, Number((_a = this.query.limit) !== null && _a !== void 0 ? _a : defaultLimit)); // ?? হলো nullish coalescing—বাম দিকের ভ্যালু null বা undefined হলে ডান দিকটা নেয়।
            const page = Math.max(1, Number((_b = this.query.page) !== null && _b !== void 0 ? _b : defaultPage)); // limit and page should never be less than 1.
            const filter = this.docs.getFilter();
            const totalToursCount = yield this.model.countDocuments(filter);
            const totalPages = Math.max(1, Math.ceil(totalToursCount / limit));
            return {
                total: totalToursCount,
                totalPages,
                currentPage: page,
                limit
            };
        });
    }
}
exports.TourQueryBuilderClass = TourQueryBuilderClass;
/*
`.lean()` দিলে Mongoose ডকুমেন্ট **hydrate** না করে **plain JS object** রিটার্ন করে।
**ফায়দা:**    অনেক **ফাস্ট** ও কম মেমোরি—read-only API গুলোর জন্য দারুণ।
**লস:**      ডকুমেন্ট মেথড/চেঞ্জ-ট্র্যাকিং নেই (`doc.save()`, getters/setters, virtuals ইত্যাদি কাজ করবে না)।
*/
