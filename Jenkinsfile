pipeline {

    agent any

    parameters {

        choice (

            name: "START", choices: ["YES", "NO"], description: "To run or not to run"
        )
    }

    stages {

        stage("SETUP") {

            steps {

                withCredentials([
                    file (credentialsId: "env", variable: "environment"),
                    file (credentialsId: "pm2", variable: "process")
                    file (credentialsId: "config", variable: "configuration"),
                    file (credentialsId: "key", variable: "keystore"),
                    file (credentialsId: "dapp", variable: "forex"),
                ]) {
                    sh "cp \$environment .env"
                    sh "cp \$process app.process.js"
                    sh "cp \$configuration config/app.config.json"
                    sh "cp \$keystore config/key.store.json"
                    sh "cp \$forex artifacts/Forex.json"
                }
            }
        }

        stage("BUILD") {

            steps {

                sh "npm i --save"
            }
        }

        stage("RUN") {
            
            when {
                expression { params.START == "yes" }
            }
            steps {

                sh "pm2 start app.process.js"
            }
        }
    }
}