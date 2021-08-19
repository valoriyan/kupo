"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.LocalBlobStorageService = exports.BlobStorageService = void 0;
const uuid_1 = require("uuid");
const tsyringe_1 = require("tsyringe");
const fs_1 = require("fs");
const utilities_1 = require("../../utilities");
class BlobStorageService {
}
exports.BlobStorageService = BlobStorageService;
let LocalBlobStorageService = class LocalBlobStorageService extends BlobStorageService {
    constructor() {
        super();
        this.localBlobStorageDirectory = utilities_1.getEnvironmentVariable("LOCAL_BLOB_STORAGE_DIRECTORY");
    }
    saveImage({ image }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileKey = uuid_1.v4();
            const fileWritePath = this.localBlobStorageDirectory + "/" + fileKey;
            yield fs_1.appendFileSync(fileWritePath, image);
            return {
                fileKey,
            };
        });
    }
    getTemporaryImageUrl({ blobItemPointer }) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileWritePath = this.localBlobStorageDirectory + "/" + blobItemPointer.fileKey;
            return fileWritePath;
        });
    }
    ;
    deleteImage({ blobImagePointer, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this.localBlobStorageDirectory + "/" + blobImagePointer.fileKey;
            yield fs_1.unlinkSync(filePath);
            return;
        });
    }
};
LocalBlobStorageService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], LocalBlobStorageService);
exports.LocalBlobStorageService = LocalBlobStorageService;
