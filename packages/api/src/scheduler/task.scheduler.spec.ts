import { cold, Scheduler } from "jest-marbles";
import { taskSchedulerProcess } from "./task.scheduler";
import {
  dsProcedureConfigService,
  taskService,
  dossierService,
  statisticService
} from "../collector";

jest.mock("../collector");

beforeEach(() => {
  taskService.getTasksToComplete = jest.fn().mockReturnValue(
    cold("a|", {
      a: [{}]
    })
  );
  taskService.markAsCompleted = jest.fn().mockReturnValue(cold("a|"));
  dsProcedureConfigService.all = jest.fn().mockReturnValue(
    cold("a|", {
      a: [{ procedures: [] }]
    })
  );
  dossierService.deleteByProcedureIdAndDossierId = jest
    .fn()
    .mockReturnValue(cold("a|"));
  statisticService.statistic = jest.fn().mockReturnValue(cold("a|"));
});

test("should process tasks", () => {
  // When
  const stream$ = taskSchedulerProcess();

  // Then
  Scheduler.get().flush();

  expect(taskService.getTasksToComplete).toHaveBeenCalledTimes(1);
  expect(taskService.markAsCompleted).toHaveBeenCalledTimes(1);
  expect(dsProcedureConfigService.all).toHaveBeenCalledTimes(1);
  expect(dossierService.deleteByProcedureIdAndDossierId).toHaveBeenCalledTimes(
    1
  );
  expect(statisticService.statistic).toHaveBeenCalledTimes(1);

  expect(stream$).toBeObservable(cold("---a|"));
});
