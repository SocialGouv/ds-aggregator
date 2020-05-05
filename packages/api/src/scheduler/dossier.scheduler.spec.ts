import { dossierSchedulerProcess } from "./dossier.scheduler";
import { Scheduler, cold } from "jest-marbles";
import { catchError, share } from "rxjs/operators";
import {
  dsProcedureConfigService,
  ProcedureConfig,
  procedureService,
  apiResultService
} from "../collector";
import { mock, instance, when, verify, anything, anyNumber } from "ts-mockito";
import { demarcheSimplifieeService, DSProcedure } from "../demarche-simplifiee";
import { syncService } from "../sync";

jest.mock("../collector");
jest.mock("../demarche-simplifiee");
jest.mock("../sync");
jest.mock("../util");

//

const dsProcedure42 = {
  id: 42,
  label: "procedure 42"
} as DSProcedure;

const procedureConfigs: ProcedureConfig[] = [
  {
    group: { id: "id", label: "label" },
    procedures: [42]
  }
];

test.only("should update api result", () => {
  // given
  const scheduler = Scheduler.get();
  const {
    _apiResultService,
    _demarcheSimplifieeService,
    _dsProcedureConfigService,
    _procedureService,
    _syncService
  } = setupMockitos();

  // when
  const stream$ = dossierSchedulerProcess().pipe(catchError(fail), share());

  // then
  verify(_dsProcedureConfigService.all()).once();

  scheduler.expectObservable(stream$).toBe("(a|)", { a: dsProcedure42 });
  scheduler.flush();

  verify(_demarcheSimplifieeService.getDSProcedure(anyNumber())).once();

  verify(_procedureService.saveOrUpdate(anything())).never();
  verify(_syncService.allDossierItems(anything())).never();
  verify(_apiResultService.findByProcedureId(anything())).never();
});

test("should return nothing without procedure config", () => {
  // given
  const scheduler = Scheduler.get();
  const {
    _dsProcedureConfigService,
    _demarcheSimplifieeService
  } = setupMockitos();
  when(_dsProcedureConfigService.all()).thenReturn(cold("(a|)", { a: [] }));

  // when
  const stream$ = dossierSchedulerProcess().pipe(catchError(fail), share());

  // then
  scheduler.expectObservable(stream$).toBe("|");
  scheduler.flush();

  verify(_dsProcedureConfigService.all()).once();
  verify(_demarcheSimplifieeService.getDSProcedure(anything())).never();
});

//

function setupMockitos() {
  // #region apiResultService Mokitos

  const apiResultServiceMock = apiResultService as jest.Mocked<
    typeof apiResultService
  >;
  const _apiResultService = mock<typeof apiResultService>();
  apiResultServiceMock.findByProcedureId.mockImplementation(
    instance(_apiResultService).findByProcedureId
  );

  when(_apiResultService.findByProcedureId(anything())).thenCall((...args) =>
    cold("#", null, new Error(`_apiResultService.findByProcedureId(${args})`))
  );

  // #endregion

  // #region demarcheSimplifieeService Mokitos

  const demarcheSimplifieeServiceMock = demarcheSimplifieeService as jest.Mocked<
    typeof demarcheSimplifieeService
  >;
  const _demarcheSimplifieeService = mock<typeof demarcheSimplifieeService>();
  demarcheSimplifieeServiceMock.getDSProcedure.mockImplementation(
    instance(_demarcheSimplifieeService).getDSProcedure
  );

  when(
    _demarcheSimplifieeService.getDSProcedure(anything())
  ).thenCall((...args) =>
    cold(
      "#",
      null,
      new Error(`_demarcheSimplifieeService.getDSProcedure(${args})`)
    )
  );
  when(
    _demarcheSimplifieeService.getDSProcedure(procedureConfigs[0].procedures[0])
  ).thenReturn(cold("(a|)", { a: dsProcedure42 }));

  // #endregion

  // #region dsProcedureConfigService Mokitos

  const dsProcedureConfigServiceMock = dsProcedureConfigService as jest.Mocked<
    typeof dsProcedureConfigService
  >;
  const _dsProcedureConfigService = mock<typeof dsProcedureConfigService>();
  dsProcedureConfigServiceMock.all.mockImplementation(
    instance(_dsProcedureConfigService).all
  );

  when(_dsProcedureConfigService.all()).thenReturn(
    cold("(a|)", { a: procedureConfigs })
  );
  // #endregion

  // #region procedureService Mokitos

  const procedureServiceMock = procedureService as jest.Mocked<
    typeof procedureService
  >;
  const _procedureService = mock<typeof procedureService>();
  procedureServiceMock.saveOrUpdate.mockImplementation(
    instance(_procedureService).saveOrUpdate
  );

  when(_procedureService.saveOrUpdate(anything())).thenCall((...args) =>
    cold("#", null, new Error(`_procedureService.saveOrUpdate(${args})`))
  );
  when(_procedureService.saveOrUpdate(dsProcedure42)).thenReturn(cold("(a|)"));

  // #endregion

  // #region syncService Mokitos

  const syncServiceMock = syncService as jest.Mocked<typeof syncService>;
  const _syncService = mock<typeof syncService>();
  syncServiceMock.allDossierItems.mockImplementation(
    instance(_syncService).allDossierItems
  );

  when(_syncService.allDossierItems(anything())).thenCall((...args) =>
    cold("#", null, new Error(`_syncService.allDossierItems(${args})`))
  );

  // #endregion

  //

  return {
    _apiResultService,
    _demarcheSimplifieeService,
    _dsProcedureConfigService,
    _procedureService,
    _syncService
  };
}
