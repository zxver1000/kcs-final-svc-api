pipeline {
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
  }
}
