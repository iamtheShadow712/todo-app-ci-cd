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
                    }
                }
            }
        }
    }
}