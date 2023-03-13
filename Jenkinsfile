pipeline {
  environment { 
    dockerRepository = "devwhoan/kcs-apigateway"
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
        - name: docker-job
          image: docker:23.0.1-dind
          securityContext:
            privileged: true
          env:
            - name: DOCKER_TLS_CERTDIR
              value: ""
            - name: DOCKER_BUILDKIT
              value: "0"
            - name: DOCKER_CLI_EXPERIMENTAL
              value: enabled
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
                  path: "hub.txt"
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
        container('docker-job') {
          sh '''
          echo "Docker Login..."
          cat /agent-resource/cm/hub.txt | docker login --username devwhoan --password-stdin
          echo "Build Docker Image"
          docker build -t $dockerRepository:$BUILD_NUMBER .
          echo "Build Passed!"
          
          echo "Push Image to Hub"
          docker push $dockerRepository:$BUILD_NUMBER
          echo "Succeed to Push the Image $dockerRepository:$BUILD_NUMBER"
          '''
        }
      }
    }
  }
}
