pipeline {
  environment { 
    dockerRepository = "devwhoan/kcs-apigateway"
    dockerCredential = credentials('docker')
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
        container('jnlp'){
          echo "Install Dependencies.."
          sh 'npm install'
        }
    }
    stage('Test') {
        container('jnlp'){
          echo 'Unit Test Starting...'
          sh '''
          npm test
          '''
        }
    }
    stage('Docke Build') {
        container('docker') {
          echo "Docker Version"
          sh '''
          docker --version
          '''
        }
    }
  }
}
