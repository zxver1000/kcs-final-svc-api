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
    stage('Docker image Build') {
      steps {
        docker.build(dockerRepository:$BUILD_NUMBER)
      }
    }

   stage('docker image push') {
    steps {
        withDockerRegistry(credentialsId: dockerCredential, url: '') {
          sh "docker push ${dockerRepository}:${BUILD_NUMBER}"
          sh "docker push ${dockerRepository}"
        }
      }
    }
  }
}
