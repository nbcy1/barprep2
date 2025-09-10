// src/aws-exports.ts
const awsExports = {
  aws_project_region: 'us-east-1', // change to your region
  aws_appsync_graphqlEndpoint: 'https://your-api-id.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY', // or 'AMAZON_COGNITO_USER_POOLS' later
  aws_appsync_apiKey: 'YOUR_API_KEY_HERE',   // replace with actual key after push
};

export default awsExports;
