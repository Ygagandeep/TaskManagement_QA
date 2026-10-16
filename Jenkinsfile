
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code is fetched from GitHub by Jenkins.'
            }
        }

        stage('Check Tools') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'git --version'
            }
        }

        stage('Check Docker') {
            steps {
                bat 'docker --version'
                bat 'docker info'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Check Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'node --check server.js'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                bat 'docker build -t taskmanagement-frontend:latest frontend'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                bat 'docker build -t taskmanagement-backend:latest backend'
            }
        }

        stage('Build Summary') {
            steps {
                echo 'Frontend build, backend syntax check, and Docker image builds completed.'
            }
        }
    }
}
