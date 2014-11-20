
// createSyllableDomain(chooseFromNextTable, chooseFromPrevTable)

function createSyllableDomain(opts) {

  return {
    chooseFromNextTable: opts.chooseFromNextTable,
    chooseFromPrevTable: opts.chooseFromPrevTable
  };
}

module.exports = {
  createSyllableDomain: createSyllableDomain
};
