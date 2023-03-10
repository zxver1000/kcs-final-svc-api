pipeline {
  environment { 
    repository = "devwhoan/kcs-apigateway"
    DOCKERHUB_CREDENTIALS = credentials('docker')
    dockerImage = '' 
  }
  agent { 
    node {
      label 'jenkins-k8s-agent'
    }
  }
  tools {nodejs "nodejs-16.16.0"}
  stages {
    stage('Install Dependencies') {
      steps {
        echo "Install Dependencies.."
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        echo 'Unit Test Starting...'
        sh '''
        npm test
        '''
      }
    }
    stage('Done') {
      steps {
        echo 'Can you See me?'
      }
    }
  
    stage('Build Docker Image') { 
      steps { 
        script { 
          dockerImage = docker.build 0000 + ":$BUILD_NUMBER" 
        }
      } 
    }
    stage('Login'){
      steps{
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    stage('Deploy our image') { 
      steps { 
        script {
          sh 'docker push $repository:$BUILD_NUMBER'
        } 
      }
    } 
    stage('Cleaning up') { 
      steps { 
          sh "docker rmi $repository:$BUILD_NUMBER"
      }
    } 
  }
}
