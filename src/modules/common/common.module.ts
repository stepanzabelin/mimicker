import {
  ClirioHelper,
  Command,
  Empty,
  Failure,
  Helper,
  Module,
  Options,
  Params,
} from 'clirio';
import { injectable } from 'tsyringe';
import { CommonHelpCommandService } from './actions/common-help';
import { CommonVersionCommandService } from './actions/common-version';
import { CommonEmptyCommandService } from './actions/common-empty';
import { CommonFailureCommandService } from './actions/common-failure';
import {
  CreateCommandService,
  CreateOptionsDto,
  CreateParamsDto,
} from './actions/create';

@Module()
@injectable()
export class CommonModule {
  constructor(
    private readonly createCommandService: CreateCommandService,
    private readonly commonHelpCommandService: CommonHelpCommandService,
    private readonly commonVersionCommandService: CommonVersionCommandService,
    private readonly commonEmptyCommandService: CommonEmptyCommandService,
    private readonly commonFailureCommandService: CommonFailureCommandService,
  ) {}

  @Command('create <source> <dist>')
  public create(
    @Params() params: CreateParamsDto,
    @Options() options: CreateOptionsDto,
  ) {
    this.createCommandService.entry(params, options);
  }

  @Command('-h, --help', { hidden: true })
  public help(@Helper() helper: ClirioHelper) {
    this.commonHelpCommandService.entry(helper);
  }

  @Command('-v, --version')
  public version() {
    this.commonVersionCommandService.entry();
  }

  @Empty()
  public empty() {
    this.commonEmptyCommandService.entry();
  }

  @Failure()
  public failure() {
    this.commonFailureCommandService.entry();
  }
}
