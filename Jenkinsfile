pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@13.207.151.21"
        APP_PATH = "/var/www/html"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/yogeshwarEminence/BMI-Calculator.git'
            }
        }

        stage('Build') {
            steps {
                sh '''
                docker run --rm \
                    -v $WORKSPACE:/app \
                    -w /app \
                    node:22-alpine \
                    sh -c "
                        npm install &&
                        npm run build
                    "
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                scp -o StrictHostKeyChecking=no -r dist/* $APP_SERVER:$APP_PATH/

                ssh -o StrictHostKeyChecking=no $APP_SERVER '
                    sudo systemctl reload nginx
                '
                '''
            }
        }
    }
}