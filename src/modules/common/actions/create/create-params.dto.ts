import { Param } from 'clirio';
import Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class CreateParamsDto {
  @Param('source')
  @JoiSchema(Joi.string().required())
  readonly source: string;

  @Param('dist')
  @JoiSchema(Joi.string().required())
  readonly dist: string;
}
