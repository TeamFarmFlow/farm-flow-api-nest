pipeline {
  agent any

  stages {
    stage('Deploy Migration') {
      when {
        beforeAgent true
        anyOf {
          changeset "Jenkinsfile"
          changeset "libs/**"
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/migration/**"
        }
      }
      steps {
        withCredentials([
          file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV'),
          file(credentialsId: 'farm-flow-migration-env', variable: 'APP_ENV'),
        ]) {
          sh '''
            writeFile file: '.env', text: ROOT_ENV_TEXT
            writeFile file: 'apps/migration/.env', text: APP_ENV_TEXT
            chmod 600 .env apps/migration/.env
            sh apps/migration/deploy.sh
            rm -f .env apps/migration/.env
          '''
        }
      }
    }

    stage('Deploy Worker') {
      when {
        beforeAgent true
        anyOf {
          changeset "Jenkinsfile"
          changeset "libs/**"
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/worker/**"
        }
      }
      steps {
        withCredentials([
          file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV'),
          file(credentialsId: 'farm-flow-worker-env', variable: 'APP_ENV'),
        ]) {
          sh '''
            writeFile file: '.env', text: ROOT_ENV_TEXT
            writeFile file: 'apps/worker/.env', text: APP_ENV_TEXT
            chmod 600 .env apps/worker/.env
            sh apps/worker/deploy.sh
            rm -f .env apps/worker/.env
          '''
        }
      }
    }

    stage('Deploy API') {
      when {
        beforeAgent true
        anyOf {
          changeset "Jenkinsfile"
          changeset "libs/**"
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/api/**"
        }
      }
      steps {
        withCredentials([
          file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV'),
          file(credentialsId: 'farm-flow-api-env', variable: 'APP_ENV'),
        ]) {
          sh '''
            writeFile file: '.env', text: ROOT_ENV_TEXT
            writeFile file: 'apps/api/.env', text: APP_ENV_TEXT
            chmod 600 .env apps/api/.env
            sh apps/api/deploy.sh
            rm -f .env apps/api/.env
          '''
        }
      }
    }
  }
}
