pipeline {

    agent any

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        choice(
            name: 'ENV',
            choices: ['DEV', 'PROD'],
            description: 'Select Deployment Environment'
        )
    }

    environment {
        APP_SERVER = 'ubuntu@43.205.243.8'
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                script {

                    if (params.ENV == "DEV") {
                        env.GIT_BRANCH = "dev"
                        env.DEPLOY_PATH = "/var/www/dev"
                    } else {
                        env.GIT_BRANCH = "main"
                        env.DEPLOY_PATH = "/var/www/prod"
                    }

                }

                git branch: env.GIT_BRANCH,
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

                rm -rf /tmp/bmi-dist

                mkdir -p /tmp/bmi-dist

                docker cp bmi-temp:/usr/share/nginx/html/. /tmp/bmi-dist/

                docker rm -f bmi-temp
                '''

            }
        }

        stage('Deploy') {
            steps {

                sh """
                scp -o StrictHostKeyChecking=no -r /tmp/bmi-dist/* ${APP_SERVER}:${DEPLOY_PATH}/

                ssh -o StrictHostKeyChecking=no ${APP_SERVER} "
                    sudo systemctl reload nginx
                "
                """

            }
        }

    }

    post {

        success {

            echo "Deployment Successful"

        }

        failure {

            echo "Deployment Failed"

        }

    }

}