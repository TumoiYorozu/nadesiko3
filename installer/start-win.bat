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
  rem PAUSE
  EXIT
)
*/0;
// --------------------------------------------
// �������� Node.js �̃v���O����
// --------------------------------------------
const fs = require('fs')
const child_process = require('child_process')
const execSync = child_process.execSync
const exec = child_process.exec

// --------------------------------------------
// �f���T�[�o�[���N��
const root = execSync('npm -g root').toString().replace(/\s+/, '')
const nadesiko = root + "\\nadesiko3"
const bat = nadesiko + '\\bin\\nako3server.bat'
exec('start cmd /c ' + bat)
setTimeout(function() {
    process.exit()
}, 3000)








