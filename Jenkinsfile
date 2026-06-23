pipeline {

    agent any

    parameters {
        choice(
            name: 'ENV',
            choices: ['DEV', 'PROD'],
            description: 'Select Deployment Environment'
        )
    }

    environment {
        GIT_URL = 'https://github.com/yogeshwarEminence/BMI-Calculator.git'
        APP_SERVER = '13.127.138.54'
        DEPLOY_PATH = '/var/www/html'
        IMAGE_NAME = 'bmi-app'
    }

    stages {

        stage('Select Branch') {
            steps {
                script {

                    if (params.ENV == "DEV") {
                        env.GIT_BRANCH = "dev"
                    } else {
                        env.GIT_BRANCH = "main"
                    }

                    echo "===================================="
                    echo "Environment : ${params.ENV}"
                    echo "Branch      : ${env.GIT_BRANCH}"
                    echo "===================================="
                }
            }
        }

        stage('Checkout Source Code') {
            steps {
                deleteDir()

                git branch: env.GIT_BRANCH,
                    url: env.GIT_URL
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME} .
                """
            }
        }

        stage('Extract Build Files') {
            steps {
                sh """
                    docker rm -f bmi-temp || true

                    docker create --name bmi-temp ${IMAGE_NAME}

                    rm -rf /tmp/bmi-dist
                    mkdir -p /tmp/bmi-dist

                    docker cp bmi-temp:/usr/share/nginx/html/. /tmp/bmi-dist/

                    docker rm -f bmi-temp
                """
            }
        }

        stage('Deploy to Application Server') {
            steps {
                sh """
                    scp -o StrictHostKeyChecking=no -r /tmp/bmi-dist/* ubuntu@${APP_SERVER}:${DEPLOY_PATH}/
                """
            }
        }

    }

    post {

        success {
            echo "===================================="
            echo "Deployment Successful"
            echo "Environment : ${params.ENV}"
            echo "Branch      : ${env.GIT_BRANCH}"
            echo "===================================="
        }

        failure {
            echo "===================================="
            echo "Deployment Failed"
            echo "===================================="
        }

        always {
            sh 'docker rm -f bmi-temp || true'
        }
    }

}