pipeline{
    agent any

    tools{
        nodejs "nodejs-23.7.0"
    }

    stages{
        stage('Install Dependencies'){
            steps{
                sh "npm install --no-audit"
            }
        }

        parallel{
            stage("NPM Dependency Audit"){
                steps{
                    sh "npm audit --audit-level=critical"
                }
            }

            stage('OWASP Dependency Check'){
                steps{
                    dependencyCheck additionalArguments: ''' 
                        --out \'./\'
                        --scan \'./\'
                        -format \'ALL\' 
                        --prettyPrint''', odcInstallation: 'OWASP-depcheck-12.1'
            
            // dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                }
            }
        }
    }
}