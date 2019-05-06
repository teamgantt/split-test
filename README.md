# teamgantt-split-test

## Using the split-test library

### Recommended
1. First import the library:
```js
import {NAME_OF_SPLIT_TEST} from '/path/to/constants/split-test-experiments';
import tgSplitTest from 'teamgantt-split-test';
```

2. Check if the user is in the split-test:
```js
const isUserInSplitTest = tgSplitTest.isInExperiment(NAME_OF_SPLIT_TEST);
```
_Note: If the user is not in the current split test, it will place them in the test and return their placement._

3. The experiment should be handled in such a way that it follows the following logic:
```js
if (isUserInSplitTest) {
    // the experiment, the current user should see the changes from the split test
} else {
    // the original, the current user should not see any changes
}
```

### Using the JS file as a script tag:
1. Import the split-test bundle:
```html
<script language="javascript" src="https://split-test.teamgantt.com/index.js"></script>
```

2. Check if the user is in the split-test:
```js
var isUserInSplitTest = window.tgSplitTest.isInExperiment(NAME_OF_SPLIT_TEST);
```

3. See step #3 above.