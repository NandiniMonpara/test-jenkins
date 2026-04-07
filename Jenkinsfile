pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.59.1-noble'
            args '-u root'
        }
    }

    environment {
        CI = 'true'
        HOME = '/root'
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
                        dir('shard-1') {
                            unstash 'source'
                            sh 'npm ci'
                            sh 'npx playwright test --shard=1/4'
                            stash includes: 'blob-report/**', name: 'blob-report-1'
                            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                        }
                    }
                }
                stage('Shard 2') {
                    steps {
                        dir('shard-2') {
                            unstash 'source'
                            sh 'npm ci'
                            sh 'npx playwright test --shard=2/4'
                            stash includes: 'blob-report/**', name: 'blob-report-2'
                            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                        }
                    }
                }
                stage('Shard 3') {
                    steps {
                        dir('shard-3') {
                            unstash 'source'
                            sh 'npm ci'
                            sh 'npx playwright test --shard=3/4'
                            stash includes: 'blob-report/**', name: 'blob-report-3'
                            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                        }
                    }
                }
                stage('Shard 4') {
                    steps {
                        dir('shard-4') {
                            unstash 'source'
                            sh 'npm ci'
                            sh 'npx playwright test --shard=4/4'
                            stash includes: 'blob-report/**', name: 'blob-report-4'
                            junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                        }
                    }
                }
            }
        }

        stage('Merge and upload') {
            steps {
                dir('merge') {
                    unstash 'source'
                    sh 'npm ci'
                    dir('shard-1') { unstash 'blob-report-1' }
                    dir('shard-2') { unstash 'blob-report-2' }
                    dir('shard-3') { unstash 'blob-report-3' }
                    dir('shard-4') { unstash 'blob-report-4' }
                    sh 'mkdir -p all-blob-reports playwright-report'
                    sh 'cp shard-1/blob-report/* all-blob-reports/'
                    sh 'cp shard-2/blob-report/* all-blob-reports/'
                    sh 'cp shard-3/blob-report/* all-blob-reports/'
                    sh 'cp shard-4/blob-report/* all-blob-reports/'
                    sh 'npx playwright merge-reports --reporter=json ./all-blob-reports > playwright-report/report.json'
                    sh 'npx tdpw upload ./playwright-report --token="$TESTDINO_TOKEN"'
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
