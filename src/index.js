const { app, BrowserWindow, clipboard, ipcMain, dialog, Menu, Tray } = require('electron');
const { STSClient, GetCallerIdentityCommand, GetSessionTokenCommand } = require("@aws-sdk/client-sts");
const prompt = require('electron-prompt');
const Store = require('electron-store');
const { Notification } = require('electron');

const store = new Store();
let awsAccounts = store.get('awsAccounts', []);

function createAddAccountWindow() {
  const addAccountWindow = new BrowserWindow({
    width: 400,
    height: 580,
    title: 'STS Session Keys',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: `${__dirname}/preload.js`
    }
  });

  addAccountWindow.loadFile(`${__dirname}/addAccount.html`);
  //addAccountWindow.webContents.openDevTools();
}


ipcMain.on('addAccount', (event, newAccount) => {
  console.log(newAccount);
  newAccount.label = newAccount.nickname;

  const stsClient = new STSClient({
    region: newAccount.region,
    credentials: {
      accessKeyId: newAccount.accessKey,
      secretAccessKey: newAccount.secretKey,
    },
  });
  const getCallerIdentityCommand = new GetCallerIdentityCommand({});
  stsClient.send(getCallerIdentityCommand).then(data => {
    // Valid credentials
    newAccount.accoundId = data.Account;
    awsAccounts.push(newAccount);
    store.set('awsAccounts', awsAccounts);
    updateContextMenu();
  }).catch(error => {
    event.sender.send('accountError', 'Failed ' + error);
    app.quit();
  });

  updateContextMenu();
});

function updateContextMenu() {
  const contextMenu = Menu.buildFromTemplate([
    ...awsAccounts.sort((a, b) => { return a.label > b.label ? 1 : -1; }).map(account => ({
      label: account.label,
      click: () => handleAwsAccount(account),
    })),
    { type: 'separator' },
    {
      label: 'Add Account          ',
      click: () => createAddAccountWindow(),
    },
    { type: 'separator' },
    {
      label: 'Quit',
      role: 'quit',
    },
  ]);

  app.tray.setContextMenu(contextMenu);
}

async function handleAwsAccount(account) {
  prompt({
    title: 'Enter MFA Token',
    label: 'MFA Token:',
    value: '',
    inputAttrs: {
      type: 'text'
    },
    type: 'input'
  })
  .then((mfaToken) => {
    if (mfaToken !== null && mfaToken !== '') {
      const stsClient = new STSClient({
        region: account.region,
        credentials: {
          accessKeyId: account.accessKey,
          secretAccessKey: account.secretKey,
        },
      });
      console.log({
        region: account.region,
        credentials: {
          accessKeyId: account.accessKey,
          secretAccessKey: account.secretKey,
        },
      });
      const getSessionTokenCommand = new GetSessionTokenCommand({
        DurationSeconds: parseInt(account.duration, 10),  // assuming duration is stored in seconds
        SerialNumber: account.arn,
        TokenCode: mfaToken,
      });
      
      stsClient.send(getSessionTokenCommand).then(result => {
        const credentials = `export AWS_REGION=${account.region}
export AWS_ACCESS_KEY_ID=${result.Credentials.AccessKeyId}          
export AWS_SECRET_ACCESS_KEY=${result.Credentials.SecretAccessKey}
export AWS_SESSION_TOKEN=${result.Credentials.SessionToken}`;

        /*dialog.showMessageBox({
          title: 'AWS Credentials',
          message: credentials,
        });*/

        clipboard.writeText(credentials);

        new Notification({
          title: 'AWS Credentials',
          body: 'Successfully copied credentials to clipboard',
        }).show()

      }).catch(error => {
        console.log(error);
        throw error;
      });
    }
  })
  .catch(console.error);
}

app.whenReady().then(() => {
  app.tray = new Tray(`${__dirname}/iconTemplate.png`);
  app.dock?.hide();
  updateContextMenu();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) updateContextMenu();
});
