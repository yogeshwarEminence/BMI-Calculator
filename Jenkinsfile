pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code...'
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Manual Approval') {
            steps {
                input(
                    message: 'Deploy on which environment?',
                    parameters: [
                        choice(name: 'ENVIRONMENT', choices: ['DEV', 'PROD'],
                         description: 'Select the environment to deploy to')
                    ]
                )
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }
}
