import { ExtendedError, validateErrorsFuncType } from "../types/types";

export const validateErrors: validateErrorsFuncType = (
  validationErrorArr,
  errorMsg,
  next
) => {
  if (!validationErrorArr.isEmpty()) {
    next(new ExtendedError(errorMsg, 400));
  }
};
