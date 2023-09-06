# AWS Credentials Menu

A MacOS menu bar utility for generating AWS STS session credentials for the AWS CLI using a two-factor (MFA) token.

Usage:
- Launch the application
- Click the STS menu bar icon and choose "Add Account"
- Enter a nickname, the AWS access key ID, and the AWS secret access key, the default region to use (e.g. `us-east-1`), and the MFA token ARN
- Choose the account from the STS menu bar dropdown and enter your MFA code
- Your clipboard now contains the `export AWS_...` statements needed for CLI work, paste into a terminal and off you go

Icon:
https://fontawesome.com/icons/key?f=sharp&s=regular