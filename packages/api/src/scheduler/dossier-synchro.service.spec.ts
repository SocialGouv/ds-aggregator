import { mock, instance, verify, when, anything } from "ts-mockito";
import { share, catchError } from "rxjs/operators";
import { cold, Scheduler } from "jest-marbles";
import {
  dsProcedureConfigService,
  dossierService,
  ProcedureConfig,
  DossierRecord
} from "../collector";
import { demarcheSimplifieeService, DSDossier } from "../demarche-simplifiee";
import { dossierSynchroService } from "./dossier-synchro.service";

jest.mock("../util");
jest.mock("../collector");
jest.mock("../demarche-simplifiee");

//

const procedureId = 24;
const dossierId = 42;
const procedureConfig: ProcedureConfig = {
  group: { id: "id", label: "label" },
  procedures: []
};
const dossier = { id: dossierId } as DSDossier;
const recordDossier = { ds_key: "ds_key" } as DossierRecord;

test("should save the dossier 42 in procedure 24 with given procedure config", () => {
  // Given
  const {
    _demarcheSimplifieeService,
    _dsProcedureConfigService,
    _dossierService
  } = setupMockitos();
  const scheduler = Scheduler.get();

  // When
  const stream$ = dossierSynchroService
    .syncDossier(procedureId, dossierId, undefined, procedureConfig)
    .pipe(catchError(fail), share());

  scheduler
    .expectObservable(stream$)
    .toBe("a|", { a: { ...dossier, created_at: "created_at" } });
  scheduler.flush();

  // Then
  verify(_dsProcedureConfigService.findByProcedureId(procedureId)).never();
  verify(
    _demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
  ).once();
  verify(
    _dossierService.save(procedureConfig.group, procedureId, dossier)
  ).once();
  verify(_dossierService.update(anything(), anything())).never();
});

test("should save the dossier 42 in procedure 24 with config from procedure id", async () => {
  // Given
  const {
    _demarcheSimplifieeService,
    _dsProcedureConfigService,
    _dossierService
  } = setupMockitos();
  const scheduler = Scheduler.get();

  // When
  const stream$ = dossierSynchroService
    .syncDossier(procedureId, dossierId)
    .pipe(catchError(fail), share());

  scheduler
    .expectObservable(stream$)
    .toBe("a|", { a: { ...dossier, created_at: "created_at" } });
  scheduler.flush();

  // Then
  verify(_dsProcedureConfigService.findByProcedureId(procedureId)).once();
  verify(
    _demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
  ).once();
  verify(_dossierService.update(anything(), anything())).never();
  verify(
    _dossierService.save(procedureConfig.group, procedureId, dossier)
  ).once();
});

test("should update the dossier 42 in procedure 24", () => {
  // Given
  const {
    _demarcheSimplifieeService,
    _dsProcedureConfigService,
    _dossierService
  } = setupMockitos();
  const scheduler = Scheduler.get();

  // When
  const stream$ = dossierSynchroService
    .syncDossier(procedureId, dossierId, recordDossier)
    .pipe(catchError(fail), share());
  scheduler
    .expectObservable(stream$)
    .toBe("a|", { a: { ...dossier, updated_at: "updated_at" } });
  scheduler.flush();

  // Then
  verify(_dsProcedureConfigService.findByProcedureId(procedureId)).once();
  verify(
    _demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
  ).once();
  verify(_dossierService.save(anything(), anything(), anything())).never();
  verify(_dossierService.update(recordDossier, dossier)).once();
});

test("should should push null when the dossier is not found", () => {
  // Given
  const {
    _demarcheSimplifieeService,
    _dsProcedureConfigService,
    _dossierService
  } = setupMockitos();
  const scheduler = Scheduler.get();

  when(
    _demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
  ).thenReturn(cold("a|", { a: null }));

  // When
  const stream$ = dossierSynchroService
    .syncDossier(procedureId, dossierId)
    .pipe(catchError(fail), share());
  scheduler.expectObservable(stream$).toBe("a|", { a: null });
  scheduler.flush();

  // Then
  verify(_dsProcedureConfigService.findByProcedureId(procedureId)).once();
  verify(
    _demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
  ).once();
  verify(_dossierService.save(anything(), anything(), anything())).never();
  verify(_dossierService.update(anything(), anything())).never();
});

//

function setupMockitos() {
  // #region demarcheSimplifieeService Mokitos

  const demarcheSimplifieeServiceMock = demarcheSimplifieeService as jest.Mocked<
    typeof demarcheSimplifieeService
  >;
  const _demarcheSimplifieeService = mock<typeof demarcheSimplifieeService>();
  demarcheSimplifieeServiceMock.getDSDossier.mockImplementation(
    instance(_demarcheSimplifieeService).getDSDossier
  );

  when(
    _demarcheSimplifieeService.getDSDossier(anything(), anything())
  ).thenCall((...args) =>
    cold(
      "#",
      null,
      new Error(`_demarcheSimplifieeService.getDSDossier(${args})`)
    )
  );
  when(
    _demarcheSimplifieeService.getDSDossier(procedureId, dossierId)
  ).thenReturn(cold("a|", { a: dossier }));

  // #endregion

  // #region dsProcedureConfigService Mokitos

  const dsProcedureConfigServiceMock = dsProcedureConfigService as jest.Mocked<
    typeof dsProcedureConfigService
  >;
  const _dsProcedureConfigService = mock<typeof dsProcedureConfigService>();
  dsProcedureConfigServiceMock.findByProcedureId.mockImplementation(
    instance(_dsProcedureConfigService).findByProcedureId
  );

  when(
    _dsProcedureConfigService.findByProcedureId(anything())
  ).thenCall((...args) =>
    cold(
      "#",
      null,
      new Error(`_dsProcedureConfigService.findByProcedureId(${args})`)
    )
  );
  when(_dsProcedureConfigService.findByProcedureId(procedureId)).thenReturn(
    cold("a|", { a: [procedureConfig] })
  );

  // #endregion

  // #region dossierService Mokitos

  const dossierServiceMock = dossierService as jest.Mocked<
    typeof dossierService
  >;
  const _dossierService = mock<typeof dossierService>();
  dossierServiceMock.save.mockImplementation(instance(_dossierService).save);
  dossierServiceMock.update.mockImplementation(
    instance(_dossierService).update
  );

  when(
    _dossierService.save(anything(), anything(), anything())
  ).thenCall((...args) =>
    cold("#", null, new Error(`_dossierService.save(${args})`))
  );
  when(
    _dossierService.save(procedureConfig.group, procedureId, dossier)
  ).thenReturn(
    cold("a|", {
      a: { ...dossier, created_at: "created_at" }
    })
  );

  when(_dossierService.update(anything(), dossier)).thenCall((...args) =>
    cold("#", null, new Error(`_dossierService.update(${args})`))
  );
  when(_dossierService.update(anything(), anything())).thenReturn(
    cold("a|", {
      a: { ...dossier, updated_at: "updated_at" }
    })
  );

  // #endregion

  //

  return {
    _demarcheSimplifieeService,
    _dsProcedureConfigService,
    _dossierService
  };
}
