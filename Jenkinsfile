pipeline{
    agent any

    tools{
        nodejs "node-23.10.0"
    }

    stages{
        stage("Installing Dependencies"){
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

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])

                        junit allowEmptyResults: true, keepProperties: true, stdioRetention: 'ALL', testResults: 'dependency-check-junit.xml'
                    }
                }
            }
        }

        stage("Unit Testing"){
            steps{
                withCredentials([string(credentialsId: 'TEST_MONGO_URI', variable: 'TEST_MONGO_URI')]) {
                    sh "npm run test"
                }

                junit allowEmptyResults: true, stdioRetention: 'ALL', testResults: 'test-results.xml'
            }
        }
    }
}