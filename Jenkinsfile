pipeline{
    agent any

    tools{
        nodejs "node-23.10.0"
    }

    environment{
        TEST_MONGO_URI = credentials('TEST_MONGO_URI')
    }

    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true
    }

    stages{
        stage("Installing Dependencies"){
            options{ timestamps() }
            steps{
                sh "npm install --no-audit"
            }
        }

        stage("Dependency Check"){
            parallel{
                stage("NPM Dependency Audit"){
                    steps{
                        sh "npm audit --audit-level=critical"
                    }
                }
                stage("OWASP Dependency Check"){
                    steps{
                        dependencyCheck additionalArguments: ''' 
                   			-o \'./\'
                   			-s \'./\'
                  			-f \'ALL\' 
                    		--prettyPrint
                        ''', odcInstallation: 'OWASP-12.1.0'
        
       				    dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                    }
                }
            }
        }

        stage("Unit Test and Coverage"){
            parallel{
                stage("Unit Testing"){
                    options{ retry(2) }
                    steps{
                        withCredentials([string(credentialsId: 'TEST_MONGO_URI', variable: 'TEST_MONGO_URI')]) {
                            sh "npm run test"
                        }
                    }
                }

                stage("Code Coverage"){
                    steps{
                        catchError(buildResult: 'SUCCESS', message: 'Need to include more Unit Test cases in the future releases.', stageResult: 'UNSTABLE') {
                            withCredentials([string(credentialsId: 'TEST_MONGO_URI', variable: 'TEST_MONGO_URI')]) {
                                sh "npm run coverage"
                            }
                        }
                    }
                }
            }
        }
    }
    post{
        always{
            junit allowEmptyResults: true, keepProperties: true, stdioRetention: 'ALL', testResults: 'dependency-check-junit.xml'
            junit allowEmptyResults: true, stdioRetention: 'ALL', testResults: 'test-results.xml'

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './coverage/lcov-report/', reportFiles: 'index.html', reportName: 'Code Coverage HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }
}