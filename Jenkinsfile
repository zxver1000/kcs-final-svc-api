pipeline {
  environment { 
    dockerRepository = "devwhoan/kcs-apigateway"
    dockerCredential = credentials('docker')
    dockerImage = '' 
  }
  agent { 
    kubernetes {
      defaultContainer 'jnlp'
      yaml """
      apiVersion: v1
      kind: Pod
      metadata:
        labels:
          app: jenkins-worker
      spec:
        containers:
        - name: docker
          image: docker:23.0.1-dind
          securityContext:
            privileged: true
          env:
            - name: DOCKER_TLS_CERTDIR
              value: ""
            - name: DOCKER_KEY
              valueFrom:
                configMapKeyRef:
                  name: agent-cm
                  key: dh-key
          volumeMounts:
            - name: config
              mountPath: /agent-resource/cm
              readOnly: true
        volumes:
          - name: config
            configMap:
              name: agent-cm
              items:
                - key: "dh-key"
                  path: "hub.yaml"
      """
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
          ls /agent-resource/cm/hub.yaml
          cat /agent-resource/cm/hub.yaml
          docker build -t $dockerRepository:$BUILD_NUMBER .
          docker push $dockerRepository:$BUILD_NUMBER
          '''
        }
      }
    }
  }
}
