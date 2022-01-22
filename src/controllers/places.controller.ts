import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "./../services/database.service";
import Place from "./../models/places";

import LooseObject from "./../interfaces/loose.object";
import UnsplashService from "./../services/unsplash.service";

export const placesController = express.Router();

placesController.get("/", async (req: Request, res: Response) => {
    let filters: LooseObject = {};
    let sort: LooseObject = {};

    const search = req?.query?.search;
    const order = req?.query?.order;

    const makeComp = (function () {
        var accents: LooseObject = {
            a: 'àáâãäåæ',
            c: 'ç',
            e: 'èéêëæ',
            i: 'ìíîï',
            n: 'ñ',
            o: 'òóôõöø',
            s: 'ß',
            u: 'ùúûü',
            y: 'ÿ'
        },
            chars = /[aceinosuy]/g;

        return function makeComp(input: string) {
            return input.replace(chars, function (c) {
                return '[' + c + accents[c] + ']';
            });
        };

    }());

    if (search) {
        filters.name = { $regex: '.*' + makeComp(search.toString()) + '.*' };
    }

    if (order) {
        sort[order.toString()] = 1;
    }

    let page = req?.query?.page ? parseInt(req.query.page as string) : 1;
    if (page < 1 || page === NaN) page = 1;
    const page_limit = 50;

    try {
        const places = (await collections.places.find(filters).sort(sort).skip((page - 1) * page_limit).limit(page_limit).toArray()) as unknown as Place[];

        res.status(200).send({
            page: page,
            total_pages: Math.ceil(await collections.places.countDocuments(filters) / page_limit),
            page_limit,
            results: places
        });

    } catch (error) {
        res.status(500).send(error.message);
    }

});

placesController.get("/:placeId", async (req: Request, res: Response) => {
    const placeId = req.params.placeId;

    try {
        const place = (await collections.places.findOne({ _id: new ObjectId(placeId) })) as unknown as Place;

        if (place) {
            res.status(200).send(place);
        } else {
            res.status(404).send("Place not found");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

placesController.post("/", async (req: Request, res: Response) => {
    try {
        const place = req.body as Place;
        const search = place.name;

        const unsplash = await UnsplashService.getPhotos(search);

        if (unsplash.results.length > 0) {
            place.photo = unsplash.results[0].urls.regular;
        } else {
            return res.status(404).send("No photo found");
        }

        const result = await collections.places.insertOne(place);
        place.id = result.insertedId

        result ? res.status(201).send(place) : res.status(500).send("Error inserting place");


    } catch (error) {
        const status = error.response.status;
        if (status === 400) {
            res.status(400).send("Bad request");
        } else if (status === 401) {
            res.status(401).send("Unauthorized");
        } else if (status === 403) {
            res.status(403).send("Forbidden");
        } else {
            res.status(500).send("Error in Unsplash API");
        }
    }
});

placesController.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedPlace: Place = req.body as Place;

        const verification = await collections.places.findOne({ _id: new ObjectId(id) }) as unknown as Place;

        if (verification && (verification.name === updatedPlace.name)) {
            return res.status(200).send(verification);
        }

        const unsplash = await UnsplashService.getPhotos(updatedPlace.name);

        if (unsplash.results.length > 0) {
            updatedPlace.photo = unsplash.results[0].urls.regular;
        } else {
            return res.status(404).send("No photo found for this name, maintaing old name/photo");
        }

        const result = await collections.places.updateOne({ _id: new ObjectId(id) }, { $set: updatedPlace });

        const place: Place = new Place(updatedPlace.name, updatedPlace.photo, result.upsertedId);

        result ? res.status(200).send(place) : res.status(500).send("Error updating place");

    }
    catch (error) {
        res.status(400).send(error.message);
    }

});

placesController.delete("/:placeId", async (req: Request, res: Response) => {
    const placeId = req?.params?.placeId;

    try {
        const place = (await collections.places.findOne({ _id: new ObjectId(placeId) })) as unknown as Place;
        const result = await collections.places.deleteOne({ _id: new ObjectId(placeId) });

        if (result && result.deletedCount) {
            res.status(202).send(place);
        } else if (!result) {
            res.status(400).send('Unable to delete place with id: ' + placeId);
        } else if (!result.deletedCount) {
            res.status(404).send('Place with id: ' + placeId + ' not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

