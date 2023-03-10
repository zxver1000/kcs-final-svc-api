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
  
    stage('NestJS Build') {
   
        steps {
          echo "Install Dependencies.."
          sh 'npm install'
        }
        steps {
          echo 'Unit Test Starting...'
          sh '''
          npm test
          '''
        }
        steps {
          echo "Install Docker"
          sh '''
          curl -sSL https://get.docker.com | bash
          docker --version
          '''
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
