# AWS Credentials Menu

<img width="230" alt="screenshot" src="https://github.com/mccahan/aws-credentials-menu/assets/2308923/660d9f3a-6b6a-433a-a083-9a77e579cdbe">

A MacOS menu bar utility for generating AWS STS session credentials for the AWS CLI using virtual MFA tokens.

When successfully authenticated, environment variable commands *will be copied to your clipboard*.

## Usage
- Launch the application
- Click the STS menu bar icon and choose "Add Account"
- Enter a nickname, the AWS access key ID, and the AWS secret access key, the default region to use (e.g. `us-east-1`), and the MFA token ARN
- Choose the account from the STS menu bar dropdown and enter your MFA code
- Your clipboard now contains the `export AWS_...` statements needed for CLI work, paste into a terminal and off you go

## Why

Using short-lived AWS access credentials with profiles in `~/.aws/credentials` can be a frustrating process - see ["How do I use an MFA token to authenticate access to my AWS resources through the AWS CLI?"](https://repost.aws/knowledge-center/authenticate-mfa-cli) and ["Using multi-factor authentication"](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html#cli-configure-role-mfa). There are techniques that can make this easier [using CLI profiles](https://stackoverflow.com/a/41965046) or [tools to manage said CLI profiles](https://github.com/broamski/aws-mfa), but also complicated.

For accounts where MFA is required to use aws-cli, I just want to be able to easily get the credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN`) into environment variables to run commands.

## It's Ugly

I know, this entire project is the tail end of some elaborate [yak shaving](https://www.techtarget.com/whatis/definition/yak-shaving). I'm hoping this saves somebody else some annoyance, but not enough to make it pretty. If you're using this, say hello!

Icon:
https://fontawesome.com/icons/key?f=sharp&s=regular
