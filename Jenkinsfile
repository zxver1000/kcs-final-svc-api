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
    podTemplate(yaml: '''
    apiVersion: v1
    kind: Pod
    spec:
      containers:
      - name: docker
        image: docker:19.03.1-dind
        securityContext:
          privileged: true
        env:
          - name: DOCKER_TLS_CERTDIR
            value: ""
    ''') {
        node(POD_LABEL) {
            container('docker') {
                sh 'docker version'
            }
        }
    }
  }
}
