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
    stage('NestJS Build') {
   
        steps {
          echo "Install and Testing.."
          sh '''
          npm install
          npm test
          '''
          sh 'npm install'
        }
      }
  
    stage('Start Docker') {
      steps {
        container('docker') {
          sh '''
          docker --version
          '''
        }
      }
    }
  }
}
