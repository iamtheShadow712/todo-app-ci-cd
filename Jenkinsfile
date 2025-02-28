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
    }
}