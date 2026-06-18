pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@13.233.88.91"
        DEPLOY_PATH = "/var/www/myapp"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy') {
            steps {
                sh """
                echo "Deploying application..."

                scp -o StrictHostKeyChecking=no -r * ${APP_SERVER}:${DEPLOY_PATH}/

                ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                    sudo systemctl restart nginx
                '
                """
            }
        }
    }
}