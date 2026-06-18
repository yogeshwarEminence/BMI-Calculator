pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "your-dockerhub-username/your-app-name"
        APP_SERVER_IP = "your.app.server.ip"
        APP_SERVER_USER = "ubuntu"  // or ec2-user
        CONTAINER_NAME = "node-app"
        APP_PORT = "3000"
    }
    
    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-cred', 
                    url: 'https://github.com/your-user/your-repo.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-cred') {
                        dockerImage.push("${BUILD_NUMBER}")
                        dockerImage.push("latest")
                    }
                }
            }
        }
        
        stage('Deploy to App Server') {
            steps {
                sshagent(['app-server-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER_USER}@${APP_SERVER_IP} '
                            docker pull ${DOCKER_IMAGE}:${BUILD_NUMBER} &&
                            docker stop ${CONTAINER_NAME} || true &&
                            docker rm ${CONTAINER_NAME} || true &&
                            docker run -d --name ${CONTAINER_NAME} \\
                                --restart unless-stopped \\
                                -p ${APP_PORT}:${APP_PORT} \\
                                ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        '
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true'
        }
    }
}