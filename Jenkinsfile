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
    stage('Docker Template') {
      container('docker') {
        stage('Build Docker Image') {
          echo "Docker Version"
          sh 'docker --version'
        }
      }
    }
  }
}
