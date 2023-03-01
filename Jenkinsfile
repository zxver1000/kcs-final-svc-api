pipeline {
  agent { 
    node {
      label 'jenkins-k8s-agent'
    }
  }
  stages {
    stage('Install Dependencies') {
      steps {
        echo "Install Dependencies.."
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        echo 'Unit Testing....'
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
