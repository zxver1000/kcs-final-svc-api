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
  
  container('jnlp'){
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
      stage('Docke Build') {
        steps {
          echo "Install Docker"
          sh '''
          curl -sSL https://get.docker.com | bash
          docker --version
          '''
        }
      }
    } 
  }
}
