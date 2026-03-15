import { IPayload } from "./constants.js";

const checkSystemUser = (cand: IPayload) => {
  return cand.role === "SYSTEM";
};

const checkAdmin = (cand: IPayload) => {
  return cand.role === "ADMIN";
};

export { checkAdmin, checkSystemUser };
