pipeline {
  agent any

  stages {
    stage('Prepare Root Env') {
      when {
        beforeAgent true
        anyOf {
          changeset "Jenkinsfile"
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/migration/**"
          changeset "apps/worker/**"
          changeset "apps/api/**"
          changeset "libs/**"
        }
      }
      steps {
        withCredentials([
          file(credentialsId: 'farm-flow-server-root-env', variable: 'ROOT_ENV_CREDENTIAL_FILE'),
        ]) {
          sh '''
            ROOT_ENV_FILE=.env
            cp "$ROOT_ENV_CREDENTIAL_FILE" "$ROOT_ENV_FILE"
            chmod 600 "$ROOT_ENV_FILE"
          '''
        }
      }
    }

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
          file(credentialsId: 'farm-flow-migration-env', variable: 'APP_ENV_CREDENTIAL_FILE'),
        ]) {
          sh '''
            APP_ENV_FILE=apps/migration/.env

            cleanup() {
              rm -f "$APP_ENV_FILE"
            }

            trap cleanup EXIT

            cp "$APP_ENV_CREDENTIAL_FILE" "$APP_ENV_FILE"
            chmod 600 "$APP_ENV_FILE"
            sh apps/migration/deploy.sh
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
              file(credentialsId: 'farm-flow-worker-env', variable: 'APP_ENV_CREDENTIAL_FILE'),
            ]) {
              sh '''
                APP_ENV_FILE=apps/worker/.env

                cleanup() {
                  rm -f "$APP_ENV_FILE"
                }

                trap cleanup EXIT

                cp "$APP_ENV_CREDENTIAL_FILE" "$APP_ENV_FILE"
                chmod 600 "$APP_ENV_FILE"
                sh apps/worker/deploy.sh
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
              file(credentialsId: 'farm-flow-api-env', variable: 'APP_ENV_CREDENTIAL_FILE'),
            ]) {
              sh '''
                APP_ENV_FILE=apps/api/.env

                cleanup() {
                  rm -f "$APP_ENV_FILE"
                }

                trap cleanup EXIT

                cp "$APP_ENV_CREDENTIAL_FILE" "$APP_ENV_FILE"
                chmod 600 "$APP_ENV_FILE"
                sh apps/api/deploy.sh
              '''
            }
          }
        }
      }
    }

    stage('Cleanup Root Env') {
      when {
        beforeAgent true
        anyOf {
          changeset "Jenkinsfile"
          changeset "package.json"
          changeset "pnpm-lock.yaml"
          changeset "tsconfig.json"
          changeset "tsconfig.build.json"
          changeset "apps/migration/**"
          changeset "apps/worker/**"
          changeset "apps/api/**"
          changeset "libs/**"
        }
      }
      steps {
        sh '''
          ROOT_ENV_FILE=.env
          rm -f "$ROOT_ENV_FILE"
        '''
      }
    }
  }

  post {
    always {
      sh '''
        ROOT_ENV_FILE=.env
        rm -f "$ROOT_ENV_FILE"
      '''
    }
  }
}
