# TestDino - Jenkins Playwright Example

This is an example project that shows how to run Playwright tests on Jenkins with 4 shards and upload the merged report to TestDino.

Tool URL: [Jenkins](https://www.jenkins.io/)

The example pipeline:

- installs dependencies and Playwright browsers
- runs Playwright tests in 4 parallel shards
- stores blob reports from each shard
- merges the shard reports into `playwright-report/report.json`
- uploads the merged report to TestDino

Create a Jenkins secret text credential with ID `TESTDINO_TOKEN`.

Copy this folder into the root of your repository and keep `Jenkinsfile` at the repository root.

Local commands:

```bash
npm ci
npx playwright install
npx playwright test
npx tdpw upload ./playwright-report --token="YOUR_TESTDINO_TOKEN"
```

## Sample tests included

This example includes multiple test files so shard-based CI examples actually distribute work.

The sample suite includes:

- passing tests across multiple spec files
- one skipped test for reporting coverage
- one expected-failure test using `test.fail()` for reporting coverage

The skipped and expected-failure tests are intentional example cases. They are included to show richer reporting behavior without making the pipeline genuinely flaky.

