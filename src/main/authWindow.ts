import { BrowserWindow } from 'electron';

const authParams: {
  [key: string]: string;
} = {
  naver:
    'https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=n17S8Y2NlUNp4JAKP5kv&redirect_uri=http://member.imbc.com/Login/sns/app/naver.aspx&state=cd0ecf56-98e2-4245-b270-dff7e3ef49b6',
  kakao:
    'https://kauth.kakao.com/oauth/authorize?client_id=ab4b12f93f26782a21a98474e0ab6dcc&redirect_uri=http://member.imbc.com/login/sns/app/kakao.aspx&response_type=code',
  facebook:
    'https://www.facebook.com/dialog/oauth?client_id=598720037211045&redirect_uri=https://snslogin.imbc.com/Facebook/FacebookAppCallback&response_type=code&scope=public_profile,email',
};

const openAuthWindow = async (snsType: string) => {
  let authWindow: BrowserWindow | null = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });

  authWindow.removeMenu();

  const requestURI = authParams[snsType];

  authWindow.loadURL(requestURI);
  authWindow.show();

  authWindow.on('closed', () => {
    authWindow = null;
  });

  return new Promise((resolve) => {
    if (authWindow) {
      authWindow.webContents.on('will-navigate', async (_, newUrl) => {
        const uri = new URL(newUrl);
        const targetUrls = [
          'http://member.imbc.com/login/ApiLoginProcess.aspx',
          'https://member.imbc.com/login/ApiLoginProcess.aspx',
        ];

        if (targetUrls.includes(uri.href)) {
          const contents = await authWindow?.webContents.executeJavaScript(
            'document.querySelector("body").innerHTML'
          );
          authWindow?.close();
          setTimeout(() => resolve(JSON.parse(contents)), 300);
        }
      });
      return;
    }

    throw new Error('no windows');
  });
};

const handleLoginResult = async (loginAction: { [key: string]: string }) => {
  if (loginAction.ActionURL) {
    let socialWindow: BrowserWindow | null = new BrowserWindow({
      width: 800,
      height: 700,
      show: false,
    });
    socialWindow.removeMenu();
    socialWindow.loadURL(loginAction.ActionURL);
    socialWindow.show();
    socialWindow.on('closed', () => {
      socialWindow = null;
    });
  }
};

export { openAuthWindow, handleLoginResult };
