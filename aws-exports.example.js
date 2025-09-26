// aws-exports.example.js
// Copy this file to aws-exports.js and replace with actual values

const awsconfig = {
  aws_project_region: 'us-west-2',
  aws_cognito_region: 'us-west-2',
  aws_user_pools_id: 'us-west-2_XXXXXXXXX',
  aws_user_pools_web_client_id: 'XXXXXXXXXXXXXXXXXX',
  aws_cognito_identity_pool_id: null,
  API: {
    endpoints: [
      {
        name: 'gamelift-api',
        endpoint: 'https://XXXXXXXXXX.execute-api.us-west-2.amazonaws.com/prod',
      },
    ],
    REST: {
      'gamelift-api': {
        endpoint: 'https://XXXXXXXXXX.execute-api.us-west-2.amazonaws.com/prod',
      },
    },
  },
};

export default awsconfig;
