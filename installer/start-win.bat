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

// �Ȃł����C���X�g�[���f�B���N�g��������
const root = execSync('npm -g root').toString()
const nadesiko = root + "\\nadesiko3"
execSync(nadesiko + "\\bin\\nako3-server.bat")
console.log("ok.");









