pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@15.206.169.136"
        APP_PATH = "/var/www/html"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/yogeshwarEminence/BMI-Calculator.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t bmi-app .
                '''
            }
        }

        stage('Extract Build Files') {
            steps {
                sh '''
                docker rm -f bmi-temp || true

                docker create --name bmi-temp bmi-app

                rm -rf dist

                docker cp bmi-temp:/app/dist ./dist

                docker rm bmi-temp
                '''
            }
        }

        stage('Deploy to App Server') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no $APP_SERVER "rm -rf /tmp/dist"

                scp -o StrictHostKeyChecking=no -r dist $APP_SERVER:/tmp/

                ssh -o StrictHostKeyChecking=no $APP_SERVER "
                    sudo rm -rf $APP_PATH/*
                    sudo cp -r /tmp/dist/* $APP_PATH/
                    sudo systemctl reload nginx
                "
                '''
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully.'
        }

        failure {
            echo 'Deployment failed.'
        }
    }
}