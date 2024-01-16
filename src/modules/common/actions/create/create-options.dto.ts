import { Transform, Clirio, Option } from 'clirio';
import Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class CreateOptionsDto {
  @Option('--replace, -r')
  @Transform(Clirio.form.ARRAY)
  @JoiSchema(Joi.array().items(Joi.string()).required())
  readonly replace: string[];

  @Option('--clear, -c')
  @Transform(Clirio.form.FLAG)
  @JoiSchema(Joi.string().required())
  readonly clear: boolean;
}
