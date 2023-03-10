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
  
  node('jenkins-k8s-agent') {
    stage('Install Dependencies') {
      steps{
        container('jnlp'){
          echo "Install Dependencies.."
          sh 'npm install'
        }
      }
    }
    stage('Test') {
      steps{
        container('jnlp'){
          echo 'Unit Test Starting...'
          sh '''
          npm test
          '''
        }
      }
    }
    stage('Docke Build') {
      steps{
        container('docker') {
          echo "Docker Version"
          sh '''
          docker --version
          '''
        }
      }
    }
  }
}
