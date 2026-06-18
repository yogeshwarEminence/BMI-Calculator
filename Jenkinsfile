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

        stage('Build React App') {
            steps {
                sh '''
                docker run --rm \
                  -v $PWD:/app \
                  -w /app \
                  node:20 \
                  bash -c "npm install && npm run build"
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                scp -r dist/* ${APP_USER}@${APP_SERVER}:${DEPLOY_PATH}/
                '''
            }
        }

        stage('Reload Nginx') {
            steps {
                sh '''
                ssh ${APP_USER}@${APP_SERVER} "sudo systemctl reload nginx"
                '''
            }
        }

    }

}