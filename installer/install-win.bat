rem=/* ���{��v���O���~���O����u�Ȃł����vv3
@echo OFF
node %~0 %*
IF "%ERRORLEVEL%"=="9009" (
  ECHO ------------------------------------
  ECHO �Ȃł���3 Windows�����C���X�g�[���[
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
const fs = require('fs')
const execSync = require('child_process').execSync
try {
  // �C���X�g�[������Ă��邩�`�F�b�N
  const cnakoVersion =  execSync('cnako3 -v').toString()
  console.log("INSTALLED version=", cnakoVersion)
} catch (e) {
  // console.log(e);
  console.log("INSTALL NADESIKO3 --- Please wait a moment")
  const result =  execSync('CALL npm -g install nadesiko3');
  console.log(result.toString());
}
console.log("ok.");









