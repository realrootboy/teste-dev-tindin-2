import { ObjectId } from "mongodb";

export default class Place {
    constructor(
        public name: string,
        public photo?: string,
        public id?: ObjectId,
    ) {}

    static validator() {
        return {
            $jsonSchema: {
                bsonType: "object",
                required: ["name"],
                additionalProperties: true,
                properties: {
                    _id: {},
                    name: {
                        bsonType: "string",
                        description: "'name' must be a string and is required",
                    },
                }
            }
        }
    }

}