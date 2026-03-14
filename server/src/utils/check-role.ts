import { IPayload } from "./constants.js";

const checkSystem = (cand: IPayload) => {
  return cand.role === "SYSTEM";
};

const checkAdmin = (cand: IPayload) => {
  return cand.role === "ADMIN";
};

export { checkAdmin, checkSystem };
