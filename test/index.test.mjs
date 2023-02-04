import * as tgSplitTest from '../src/index.cjs';

const {default: fn} = tgSplitTest;

console.log('This is not a real test with assertions.');
console.log(
  'However, you should see that each run is a 48/52 split or better.'
);
console.log(
  'There may be the occasional outlier, but you should see even splits pretty consistently.'
);
console.log(
  'As well as the total of all the runs being right at 50/50 with a small deviation.'
);
console.log('');

const bigRuns = 20;

let totalTrue = 0;
let totalFalse = 0;

for (let b = 0; b < bigRuns; b++) {
  const runs = 1200;
  const results = [];

  for (let i = 0; i < runs; i++) {
    results.push(fn.isInExperiment('foo bar'));
  }

  const trueRuns = results.filter(r => r === true).length;
  const falseRuns = results.filter(r => r === false).length;

  totalTrue += trueRuns;
  totalFalse += falseRuns;

  console.log({
    trueRuns,
    falseRuns,
    balance: (trueRuns / runs) * 100,
  });
}

console.log({
  totalTrue,
  totalFalse,
  balance: (totalTrue / (totalTrue + totalFalse)) * 100,
});
