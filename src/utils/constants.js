//(function () {
  const SHAPES = ['h', 'd', 'c', 's'];
  const VALUES = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
  const valueToNum = {j: 10, q: 10, k: 10};
  
  const acesCountToPossibleValuesMap = new Map();
  acesCountToPossibleValuesMap.set(1, [11, 1]);
  acesCountToPossibleValuesMap.set(2, [12, 2]);
  acesCountToPossibleValuesMap.set(3, [13, 3]);
  acesCountToPossibleValuesMap.set(4, [14, 4]);

  export {SHAPES, VALUES, valueToNum, acesCountToPossibleValuesMap};
//})();