import * as fs from 'fs';
import * as mongoose from 'mongoose';

/**
 * Remove file.
 * @param filePath
 */
export const unlinkFile = function(filePath) {
  // Assuming that 'path/file.txt' is a regular file.
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
}
export const isValidMongoId = function (id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}  