pipeline {
    agent any

    environment {
        APP_SERVER = "13.233.88.91"
        APP_USER = "ubuntu"
        DEPLOY_PATH = "/var/www/html"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh """
                scp -o StrictHostKeyChecking=no -r dist/* ${APP_USER}@${APP_SERVER}:${DEPLOY_PATH}/
                """
            }
        }

        stage('Restart Nginx') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no ${APP_USER}@${APP_SERVER} 'sudo systemctl restart nginx'
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful'
        }

        failure {
            echo 'Deployment Failed'
        }
    }
}