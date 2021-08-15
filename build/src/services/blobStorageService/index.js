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
exports.generateLocalBlobStorageService = void 0;
const uuid_1 = require("uuid");
const fs_1 = require("fs");
function generateLocalBlobStorageService({ localBlobStorageDirectory, }) {
    return __awaiter(this, void 0, void 0, function* () {
        function saveImage({ image }) {
            return __awaiter(this, void 0, void 0, function* () {
                const fileKey = uuid_1.v4();
                const fileWritePath = localBlobStorageDirectory + "/" + fileKey;
                yield fs_1.appendFileSync(fileWritePath, image);
                return {
                    fileKey,
                };
            });
        }
        function deleteImage({ blobImagePointer, }) {
            return __awaiter(this, void 0, void 0, function* () {
                const filePath = localBlobStorageDirectory + "/" + blobImagePointer.fileKey;
                yield fs_1.unlinkSync(filePath);
                return;
            });
        }
        return {
            image: {
                save: saveImage,
                delete: deleteImage,
            },
        };
    });
}
exports.generateLocalBlobStorageService = generateLocalBlobStorageService;
