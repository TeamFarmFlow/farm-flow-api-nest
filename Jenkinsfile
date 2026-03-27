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
          string(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_TEXT'),
          string(credentialsId: 'farm-flow-migration-env', variable: 'APP_ENV_TEXT'),
        ]) {
          sh '''
            printf '%s\n' "$ROOT_ENV_TEXT" > .env
            printf '%s\n' "$APP_ENV_TEXT" > apps/migration/.env
            chmod 600 .env apps/migration/.env
            echo '[DEBUG] root env contents'
            cat .env
            echo '[DEBUG] migration env contents'
            cat apps/migration/.env
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
              string(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_TEXT'),
              string(credentialsId: 'farm-flow-worker-env', variable: 'APP_ENV_TEXT'),
            ]) {
              sh '''
                printf '%s\n' "$ROOT_ENV_TEXT" > .env
                printf '%s\n' "$APP_ENV_TEXT" > apps/worker/.env
                chmod 600 .env apps/worker/.env
                echo '[DEBUG] root env contents'
                cat .env
                echo '[DEBUG] worker env contents'
                cat apps/worker/.env
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
              string(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_TEXT'),
              string(credentialsId: 'farm-flow-api-env', variable: 'APP_ENV_TEXT'),
            ]) {
              sh '''
                printf '%s\n' "$ROOT_ENV_TEXT" > .env
                printf '%s\n' "$APP_ENV_TEXT" > apps/api/.env
                chmod 600 .env apps/api/.env
                echo '[DEBUG] root env contents'
                cat .env
                echo '[DEBUG] api env contents'
                cat apps/api/.env
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
