pipeline{
    agent any

    tools{
        nodejs "node-23.10.0"
    }

    // environment{
    //     PORT =
    // }

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
            }
        }
    }
}