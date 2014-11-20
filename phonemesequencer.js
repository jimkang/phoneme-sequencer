
// createSyllableDomain(chooseFromNextTable, chooseFromPrevTable)

function createSyllableDomain(opts) {
  function next() {

  }

  function prev() {

  }

  function createChain() {

  }

  return {
    chooseFromNextTable: opts.chooseFromNextTable,
    chooseFromPrevTable: opts.chooseFromPrevTable,
    next: next,
    prev: prev,
    createChain: createChain
  };
}

module.exports = {
  createSyllableDomain: createSyllableDomain
};
