import * as path from 'path';
import { stat } from 'fs/promises';
import { injectable } from 'tsyringe';

@injectable()
export class FsService {
  async exists(path: string): Promise<boolean> {
    return stat(path)
      .then(() => true)
      .catch(() => false);
  }

  toPath(filepath: string): string {
    if (path.isAbsolute(filepath)) {
      return filepath;
    }

    return path.resolve(process.cwd(), filepath);
  }
}
