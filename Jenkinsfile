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

        rm -rf /tmp/bmi-dist
        mkdir -p /tmp/bmi-dist

        docker cp bmi-temp:/usr/share/nginx/html/. /tmp/bmi-dist/

        docker rm -f bmi-temp
        '''
    }
}

stage('Deploy to App Server') {
    steps {
        sh '''
        scp -o StrictHostKeyChecking=no -r /tmp/bmi-dist/* ubuntu@<APP_SERVER_IP>:/var/www/html/

        ssh -o StrictHostKeyChecking=no ubuntu@<APP_SERVER_IP> "
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