pipeline {
  environment { 
    dockerRepository = "devwhoan/kcs-apigateway"
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
    withDockerRegistry(credentialsId: DOCKERHUB_CREDENTIALS, url: '') {
    // withDockerRegistry : docker pipeline 플러그인 설치시 사용가능.
    // dockerHubRegistryCredential : environment에서 선언한 docker_cre  
      sh '''
        docker build ${dockerRepository}:${BUILD_NUMBER} .
        docker push ${dockerRepository}
      '''
    }

  }
}
