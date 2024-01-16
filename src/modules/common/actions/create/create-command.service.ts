import { injectable } from 'tsyringe';
import * as path from 'path';
import * as util from 'util';
import { exec } from 'child_process';

import { CreateOptionsDto } from './create-options.dto';
import { FsService, NamingService } from '../../services';
import { ResultService } from '../../../../services';
import { CreateParamsDto } from './create-params.dto';
import { ClirioCommonError } from 'clirio';
import { readFile, writeFile } from 'fs/promises';

@injectable()
export class CreateCommandService {
  constructor(
    private readonly namingService: NamingService,
    private readonly resultService: ResultService,
    private readonly fsService: FsService,
  ) {}

  public async entry(params: CreateParamsDto, options: CreateOptionsDto) {
    const source = this.fsService.toPath(params.source);
    const dist = this.fsService.toPath(params.dist);

    const sourceExists = await this.fsService.exists(source);

    if (!sourceExists) {
      throw new ClirioCommonError(
        `The "source" path does not exist: ${source}`,
      );
    }

    const replaces = [];

    for (const replace of options.replace) {
      const parts = replace
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v);

      if (parts.length !== 2) {
        throw new ClirioCommonError(`The "replace" is wrong: ${replace}`);
      }

      replaces.push(parts);
    }

    // const distExists = await this.fsService.exists(dist);

    // if (distExists) {
    //   throw new ClirioCommonError(
    //     `The "dist" path already exist: ${dist}. Add --clear to remove it`,
    //   );
    // }

    const sourceFiles = await util
      .promisify(exec)(`find ${source}/ -type f`)
      .then(({ stdout, stderr }) => {
        if (stderr) {
          throw new ClirioCommonError(stderr);
        }
        return stdout.split('\n');
      });

    if (options.clear) {
      await util.promisify(exec)(`rm -rf ${params.dist}`);
    }

    for (let sourceFile of sourceFiles) {
      const distFile = this.namingService.replace(sourceFile, replaces);

      if (sourceFile === distFile) {
        continue;
      }

      const dir = path.dirname(distFile);

      await util.promisify(exec)(`mkdir -p ${dir}`);
      await util.promisify(exec)(`cp ${sourceFile} ${distFile}`);

      const content = await readFile(distFile, 'utf8');

      const replacedContent = this.namingService.replace(content, replaces);

      await writeFile(distFile, replacedContent, 'utf8');

      this.resultService.answer(`created`, distFile);
    }

    this.resultService.result(`result`, 'OK');
  }
}
