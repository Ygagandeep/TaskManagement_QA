
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Jenkins will fetch TaskManagement_QA from GitHub.'
            }
        }

        stage('Check Node and npm') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Build Information') {
            steps {
                echo 'Frontend: Angular'
                echo 'Backend: Node.js'
                echo 'Database: MongoDB'
                echo 'Docker deployment is already running on AWS EC2.'
            }
        }
    }
}
