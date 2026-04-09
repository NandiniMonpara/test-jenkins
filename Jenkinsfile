pipeline {
    agent any

    environment {
        CI = 'true'
        TESTDINO_TOKEN = credentials('TESTDINO_TOKEN')
    }

    options {
        timeout(time: 45, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                stash includes: '**/*', name: 'source'
            }
        }

        stage('Run Playwright shards') {
            parallel {
                stage('Shard 1') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            dir('shard-1') {
                                unstash 'source'
                                bat 'npm ci'
                                script {
                                    int exitCode = bat(returnStatus: true, script: 'npx playwright test --shard=1/4')
                                    stash includes: 'blob-report/**', name: 'blob-report-1', allowEmpty: true
                                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                                    if (exitCode != 0) {
                                        unstable('Playwright shard 1 reported test failures.')
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Shard 2') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            dir('shard-2') {
                                unstash 'source'
                                bat 'npm ci'
                                script {
                                    int exitCode = bat(returnStatus: true, script: 'npx playwright test --shard=2/4')
                                    stash includes: 'blob-report/**', name: 'blob-report-2', allowEmpty: true
                                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                                    if (exitCode != 0) {
                                        unstable('Playwright shard 2 reported test failures.')
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Shard 3') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            dir('shard-3') {
                                unstash 'source'
                                bat 'npm ci'
                                script {
                                    int exitCode = bat(returnStatus: true, script: 'npx playwright test --shard=3/4')
                                    stash includes: 'blob-report/**', name: 'blob-report-3', allowEmpty: true
                                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                                    if (exitCode != 0) {
                                        unstable('Playwright shard 3 reported test failures.')
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Shard 4') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            dir('shard-4') {
                                unstash 'source'
                                bat 'npm ci'
                                script {
                                    int exitCode = bat(returnStatus: true, script: 'npx playwright test --shard=4/4')
                                    stash includes: 'blob-report/**', name: 'blob-report-4', allowEmpty: true
                                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                                    if (exitCode != 0) {
                                        unstable('Playwright shard 4 reported test failures.')
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Merge and upload') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    dir('merge') {
                        unstash 'source'
                        bat 'npm ci'
                        script {
                            ['1', '2', '3', '4'].each { shard ->
                                try {
                                    dir("shard-${shard}") {
                                        unstash "blob-report-${shard}"
                                    }
                                } catch (err) {
                                    echo "blob-report-${shard} was not available: ${err.message}"
                                }
                            }
                        }
                        bat '''
                            if not exist all-blob-reports mkdir all-blob-reports
                            if not exist playwright-report mkdir playwright-report
                            for %%D in (shard-1 shard-2 shard-3 shard-4) do (
                                if exist "%%D\\blob-report\\*" copy /Y "%%D\\blob-report\\*" "all-blob-reports\\" >nul
                            )
                        '''
                        script {
                            int mergeExit = bat(returnStatus: true, script: '''
                                if not exist "all-blob-reports\\*" exit /b 1
                                npx playwright merge-reports --reporter=json .\\all-blob-reports > playwright-report\\report.json
                            ''')
                            if (mergeExit != 0) {
                                unstable('Merged Playwright report was not created.')
                            }
                        }
                        script {
                            int uploadExit = bat(returnStatus: true, script: '''
                                if not exist "playwright-report\\report.json" exit /b 0
                                npx tdpw upload .\\playwright-report --token="%TESTDINO_TOKEN%"
                            ''')
                            if (uploadExit != 0) {
                                unstable('Uploading results to TestDino failed.')
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'merge/playwright-report/**', allowEmptyArchive: true
        }
    }
}
