import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'celebnetwork-api',
  frameworkVersion: '3',
  plugins: ['serverless-plugin-typescript', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-south-1',
    environment: {
      DB_HOST: '${env:DB_HOST}',
      DB_PORT: '${env:DB_PORT}',
      DB_USERNAME: '${env:DB_USERNAME}',
      DB_PASSWORD: '${env:DB_PASSWORD}',
      DB_NAME: '${env:DB_NAME}',
      OPENAI_API_KEY: '${env:OPENAI_API_KEY}',
    },
  },
  functions: {
    app: {
      handler: 'dist/lambda.handler',
      events: [{ http: 'ANY /' }, { http: 'ANY /{proxy+}' }],
    },
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
