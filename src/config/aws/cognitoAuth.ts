import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, ISignUpResult } from 'amazon-cognito-identity-js'
import { userPool } from './config'

export interface ILoginData {
  username: string
  password: string
}

export interface RegisterUserData {
  username: string
  password: string
  name: string
  role: string
}

export async function cognitoCreateAccount(data: RegisterUserData): Promise<ISignUpResult | undefined> {
  const { username, password, role, name } = data

  const attributeList: CognitoUserAttribute[] = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: username
    }),
    new CognitoUserAttribute({
      Name: 'name',
      Value: name
    }),
    new CognitoUserAttribute({
      Name: 'custom:role',
      Value: role
    })
  ]

  return new Promise<ISignUpResult | undefined>((resolve, reject) => {
    userPool.signUp(username, password, attributeList, [], function (err, result) {
      if (err) {
        console.log(err)
        resolve(undefined)

        return
      }
      resolve(result)
    })
  })
}

export function cognitoAuthLogin(data: ILoginData) {
  const { username, password } = data

  const authenticationData = {
    Username: username,
    Password: password
  }

  const authenticationDetails = new AuthenticationDetails(authenticationData)

  const userData = {
    Username: username,
    Pool: userPool
  }

  const cognitoUserLogin = new CognitoUser(userData)

  return { authenticationDetails, cognitoUserLogin }
}
