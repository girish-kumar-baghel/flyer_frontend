export const cognitoAuthConfig = {
  authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_COGNITO_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT,
  response_type: "code",
  scope: "openid email phone",
};
