pipeline {
  agent any

  stages {
    stage('Migration') {
      when {
        beforeAgent true
        anyOf {
          changeset "Jenkinsfile"
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/migration/**"
        }
      }
      steps {
        withCredentials([
          file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_FILE'),
          file(credentialsId: 'farm-flow-migration-env', variable: 'APP_ENV_FILE'),
        ]) {
          sh '''
            cp "$ROOT_ENV_FILE" .env
            cp "$APP_ENV_FILE" apps/migration/.env
            chmod 600 .env apps/migration/.env
            sh apps/migration/deploy.sh
            rm -f .env apps/migration/.env
          '''
        }
      }
    }

    stage('Services') {
      parallel {
        stage('Worker') {
          when {
            beforeAgent true
            anyOf {
              changeset "Jenkinsfile"
              changeset "package.json"
              changeset "pnpm-lock.yaml"
              changeset "tsconfig.json"
              changeset "tsconfig.build.json"
              changeset "apps/worker/**"
              changeset "libs/**"
            }
          }
          steps {
            withCredentials([
              file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_FILE'),
              file(credentialsId: 'farm-flow-worker-env', variable: 'APP_ENV_FILE'),
            ]) {
              sh '''
                cp "$ROOT_ENV_FILE" .env
                cp "$APP_ENV_FILE" apps/worker/.env
                chmod 600 .env apps/worker/.env
                sh apps/worker/deploy.sh
                rm -f .env apps/worker/.env
              '''
            }
          }
        }

        stage('API') {
          when {
            beforeAgent true
            anyOf {
              changeset "Jenkinsfile"
              changeset "package.json"
              changeset "pnpm-lock.yaml"
              changeset "tsconfig.json"
              changeset "tsconfig.build.json"
              changeset "apps/api/**"
              changeset "libs/**"
            }
          }
          steps {
            withCredentials([
              file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_FILE'),
              file(credentialsId: 'farm-flow-api-env', variable: 'APP_ENV_FILE'),
            ]) {
              sh '''
                cp "$ROOT_ENV_FILE" .env
                cp "$APP_ENV_FILE" apps/api/.env
                chmod 600 .env apps/api/.env
                sh apps/api/deploy.sh
                rm -f .env apps/api/.env
              '''
            }
          }
        }
      }
    }
  }
}
