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
  
    stage('Docker Build') {
      steps {
        sh 'docker.build("devwhoan/kcs-apigateway:${env.BUILD_NUMBER}")'
      }
    }
    
    stage('Docker Login'){
      steps{
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    stage('Docker Push') {
      steps {
        sh 'docker push devwhoan/kcs-apigateway'
      }
    }
    
    stage('Cleaning up') { 
      steps { 
          sh "docker rmi $repository:$BUILD_NUMBER"
      }
    } 
  }
}
