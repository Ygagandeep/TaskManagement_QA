
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code is fetched from GitHub by Jenkins.'
            }
        }

        stage('Check Tools'){
            steps{
                bat 'node --version'
                bat 'npm --version'
                bat 'git --version'
            }
        }

        stage('Build Frontend'){
            steps{
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Check Backend'){
            steps{
                dir('backend') {
                    bat 'npm install'
                    bat 'node --check server.js'
                }
            }
        }

        stage('Build summary'){
            steps{
                echo 'Frontend build and backend syntax check completed.'
            }
        }
    }
}
