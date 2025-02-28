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

        stage("NPM Dependency Audit"){
            steps{
                sh "npm audit --audit-level=critical"
                sh "echo $?"
            }
        }
    }
}