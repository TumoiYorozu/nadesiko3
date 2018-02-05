rem=/* ���{��v���O���~���O����u�Ȃł����vv3
@echo OFF
node "%~0" %*
IF "%ERRORLEVEL%"=="9009" (
  ECHO ------------------------------------
  ECHO [�G���[�̗��R]
  ECHO ------------------------------------
  ECHO �Ȃł���3�����[�J���Ŏ��s����ɂ� Node.js ���K�v�ł��B
  ECHO ���L��Web�T�C�g����C���X�g�[�����Ă��������B
  ECHO [URL] https://nodejs.org
  ECHO �C���X�g�[����A���߂āA���̃o�b�`�t�@�C�������s���Ă��������B
  PAUSE
  EXIT
) ELSE (
  PAUSE
  EXIT
)
*/0;
// --------------------------------------------
// �������� Node.js �̃v���O����
// --------------------------------------------
const VERSION = "3.0.24"
const fs = require('fs')
const execSync = require('child_process').execSync
const opener = require('opener')
try {
  // �C���X�g�[������Ă��邩�`�F�b�N
  let cnakoVersion = execSync('cnako3 -v').toString().replace(/\s+/, '')
  if (cnakoVersion !== VERSION) {
    console.log("UPDATE")
    execSync('CALL npm -g update nadesiko3@' + VERSION)
    cnakoVersion = execSync('cnako3 -v').toString()
  }
  console.log("INSTALLED version=", cnakoVersion)
} catch (e) {
  // console.log(e);
  console.log("INSTALL NADESIKO3 --- Please wait a moment")
  const result =  execSync('CALL npm -g install nadesiko3@' + VERSION);
  console.log(result.toString());
}
// �f���T�[�o�[���N��
const root = execSync('npm -g root').toString().replace(/\s+/, '')
const nadesiko = root + "\\nadesiko3"
opener(nadesiko + '\\bin\\nako3server.bat')
console.log("ok.")



 





