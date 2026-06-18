pipeline {

    agent any

    environment {
        SERVER = "13.233.88.91"
        USER = "ubuntu"
        APP_DIR = "/home/ubuntu/<your-repo>"
    }

    stages {

        stage('Deploy') {

            steps {

                sh """
                ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} '

                cd ${APP_DIR}

                echo "Pulling latest code..."
                git pull origin main

                echo "Building React App..."

                docker run --rm \
                    -v \$PWD:/app \
                    -w /app \
                    node:20 \
                    bash -c "npm install && npm run build"

                echo "Deploying..."

                sudo rm -rf /var/www/html/*

                sudo cp -r dist/* /var/www/html/

                sudo systemctl restart nginx

                '

                """
            }
        }

    }

}