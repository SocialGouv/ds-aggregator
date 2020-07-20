import { GlobalEnvironment } from "@socialgouv/kosko-charts/types";

export default {
  requests: {
    cpu: "5m",
    memory: "128Mi",
  },

  limits: {
    cpu: "1000m",
    memory: "1Gi",
  },
} as Partial<GlobalEnvironment>;
