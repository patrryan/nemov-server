import { Injectable } from '@nestjs/common';
import * as I from './interfaces/files-service.interface';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import fileNameConverter from 'src/commons/utils/filenameConvert';

@Injectable()
export class FilesService {
  upload({ file }: I.FilesServiceUpload): Promise<string> {
    const uuid = uuidv4();
    const storage = new Storage({
      projectId: process.env.GCP_PROJECTID,
      keyFilename: process.env.GCP_STORAGE,
    }).bucket(process.env.GCP_BUCKET);

    const filename = fileNameConverter(file.filename);

    const result = new Promise<string>((resolve, reject) => {
      file
        .createReadStream()
        .pipe(sharp().toFormat('webp').webp({ quality: 80, force: true }))
        .pipe(storage.file(`${uuid}${filename}.webp`).createWriteStream({}))
        .on('finish', () =>
          resolve(
            'https://storage.googleapis.com/' +
              process.env.GCP_BUCKET +
              `/${uuid}${filename}.webp`,
          ),
        )
        .on('error', () => reject('실패했습니다.'));
    });
    return result;
  }

  upload1({ file }: I.FilesServiceUpload): Promise<string> {
    const uuid = uuidv4();
    const storage = new Storage({
      projectId: process.env.GCP_PROJECTID,
      keyFilename: process.env.GCP_STORAGE,
    }).bucket(process.env.GCP_BUCKET);

    const filename = fileNameConverter(file.filename);

    const result = new Promise<string>((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(`${uuid}${filename}`).createWriteStream({}))
        .on('finish', () =>
          resolve(
            'https://storage.googleapis.com/' +
              process.env.GCP_BUCKET +
              `/${uuid}${filename}`,
          ),
        )
        .on('error', () => reject('실패했습니다.'));
    });
    return result;
  }
}
