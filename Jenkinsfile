pipeline {
  agent any

  stages {
    stage('Deploy API') {
      when {
        beforeAgent true
        anyOf {
          changeset 'Jenkinsfile'
          changeset 'libs/**'
          changeset 'package.json'
          changeset 'pnpm-lock.yaml'
          changeset 'tsconfig.json'
          changeset 'tsconfig.build.json'
          changeset 'apps/api/**'
        }
      }
      steps {
        sh 'sh apps/api/deploy.sh'
      }
    }

    stage('Deploy Worker') {
      when {
        beforeAgent true
        anyOf {
          changeset 'Jenkinsfile'
          changeset 'libs/**'
          changeset 'package.json'
          changeset 'pnpm-lock.yaml'
          changeset 'tsconfig.json'
          changeset 'tsconfig.build.json'
          changeset 'apps/worker/**'
        }
      }
      steps {
        sh 'sh apps/worker/deploy.sh'
      }
    }

    stage('Deploy Migration') {
      when {
        beforeAgent true
        anyOf {
          changeset 'Jenkinsfile'
          changeset 'libs/**'
          changeset 'package.json'
          changeset 'pnpm-lock.yaml'
          changeset 'tsconfig.json'
          changeset 'tsconfig.build.json'
          changeset 'apps/migration/**'
        }
      }
      steps {
        sh 'sh apps/migration/deploy.sh'
      }
    }
  }
}
