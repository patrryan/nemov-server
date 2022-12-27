import { Injectable } from "@nestjs/common";
import { IFilesServiceUpload } from "./interfaces/files-service.interface";
import { Storage } from '@google-cloud/storage'


@Injectable()
export class FilesService {

  upload({ file }: IFilesServiceUpload): Promise<string> {

    const storage = new Storage({
      projectId: process.env.GCP_PROJECTID,
      keyFilename: process.env.GCP_STORAGE, //암호파일 이름
    }).bucket(process.env.GCP_BUCKET);
​
    const result = new Promise<string>((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(file.filename).createWriteStream({}))

        .on('finish', () =>
          resolve(
            'https://storage.googleapis.com/' +
              process.env.GCP_BUCKET +
              `/${file.filename}`,
          ),
        )
        .on('error', () => reject('실패했습니다.'));
    });
    return result;
  }
}