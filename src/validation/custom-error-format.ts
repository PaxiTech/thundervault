export function formatErrors(errors) {
  const errs = {};
  errors.forEach((err) => {
    errs[err.property] = errs[err.property] || [];
    const messages = [];
    for (const key in err.constraints) {
      messages.push(err.constraints[key]);
    }
    errs[err.property] = messages;
  });
  return errs;
}
