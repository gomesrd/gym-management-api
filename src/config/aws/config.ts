import { CognitoUserPool } from 'amazon-cognito-identity-js'

export const awsCognitoConfig = {
  REGION: process.env.REGION as string,
  USER_POOL_ID: process.env.USER_POOL_ID as string,
  USER_POOL_APP_CLIENT_ID: process.env.USER_POOL_APP_CLIENT_ID as string
}

const poolData = {
  UserPoolId: awsCognitoConfig.USER_POOL_ID,
  ClientId: awsCognitoConfig.USER_POOL_APP_CLIENT_ID
}

export const userPool = new CognitoUserPool(poolData)
