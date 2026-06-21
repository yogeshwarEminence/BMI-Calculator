pipeline {

    agent any

    environment {

        IMAGE_NAME = "bmi-app"
        CONTAINER_NAME = "bmi-container"
        APP_SERVER = "ubuntu@13.207.151.21"
        SSH_CREDENTIAL = "app-server"

    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'main',
                url: 'https://github.com/yourusername/BMI-Calculator.git'

            }

        }

        stage('Build Docker Image') {

            steps {

                sh '''
                docker build -t $IMAGE_NAME .
                '''

            }

        }

        stage('Save Docker Image') {

            steps {

                sh '''
                docker save -o bmi-app.tar $IMAGE_NAME
                '''

            }

        }

        stage('Copy Image To Server') {

            steps {

                sshagent(credentials: ["${SSH_CREDENTIAL}"]) {

                    sh '''
                    scp -o StrictHostKeyChecking=no bmi-app.tar $APP_SERVER:/home/ubuntu/
                    '''

                }

            }

        }

        stage('Deploy') {

            steps {

                sshagent(credentials: ["${SSH_CREDENTIAL}"]) {

                    sh '''
                    ssh -o StrictHostKeyChecking=no $APP_SERVER << EOF

                    docker stop $CONTAINER_NAME || true

                    docker rm $CONTAINER_NAME || true

                    docker rmi $IMAGE_NAME || true

                    docker load -i bmi-app.tar

                    docker run -d \
                    --name $CONTAINER_NAME \
                    -p 3000:3000 \
                    --restart always \
                    $IMAGE_NAME

                    rm bmi-app.tar

                    EOF
                    '''

                }

            }

        }

    }

}