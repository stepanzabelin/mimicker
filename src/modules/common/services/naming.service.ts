import { camelCase, upperFirst, kebabCase } from 'lodash';

import { injectable } from 'tsyringe';

@injectable()
export class NamingService {
  replace(path: string, replaces: string[][]) {
    let res = path;

    for (let [sourceName, distName] of replaces) {
      const sourceCamelCaseName = camelCase(sourceName);
      const sourcePascalCaseName = upperFirst(sourceCamelCaseName);
      const sourceKebabCaseName = kebabCase(sourceName);

      const distCamelCaseName = camelCase(distName);
      const distPascalCaseName = upperFirst(distCamelCaseName);
      const distKebabCaseName = kebabCase(distName);

      res = res.replaceAll(sourceCamelCaseName, distCamelCaseName);
      res = res.replaceAll(sourcePascalCaseName, distPascalCaseName);
      res = res.replaceAll(sourceKebabCaseName, distKebabCaseName);

      // res = res.replaceAll

      // res = res.replace(
      //   new RegExp(lowerFirst(camelCase(sourceName)), "gm"),
      //   lowerFirst(distName)
      // );
      // res = res.replace(
      //   new RegExp(upperFirst(camelCase(sourceName)), "gm"),
      //   upperFirst(distName)
      // );
      // res = res.replace(
      //   new RegExp(kebabCase(sourceName), "gm"),
      //   kebabCase(distName)
      // );
    }
    return res;
  }
}
