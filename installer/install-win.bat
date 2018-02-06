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
const VERSION = "3.0.24"
// --------------------------------------------
const fs = require('fs')
const child_process = require('child_process')
const execSync = child_process.execSync
const exec = child_process.exec
const opener = require('opener')
// --------------------------------------------
try {
    // �C���X�g�[������Ă��邩�`�F�b�N
    let cnakoVersion = execSync('cnako3 -v').toString().replace(/\s+/, '')
    console.log('cnakoVer=', cnakoVersion)
    if (gtVersion(VERSION, cnakoVersion)) {
        console.log("Checked version", VERSION, '>', cnakoVersion)
        console.log("Now, updating nadesiko3 ...")
        execSync('CALL npm -g update nadesiko3')
        cnakoVersion = execSync('cnako3 -v').toString()
    }
    console.log("Installed version=", cnakoVersion)
} catch (e) {
    console.log(e);
    console.log("Install nadesiko3...")
    const result = execSync('CALL npm -g install nadesiko3')
    console.log(result.toString());
}
// --------------------------------------------
// �f���T�[�o�[���N��
const root = execSync('npm -g root').toString().replace(/\s+/, '')
const nadesiko = root + "\\nadesiko3"
const bat = nadesiko + '\\bin\\nako3server.bat'
exec('start cmd /c ' + bat)
setTimeout(function() {
    process.exit()
}, 3000)
// opener(bat)

// �o�[�W�����`�F�b�N
function gtVersion(a, b) {
    const aa = parseFloat(a.replace(/^3\./, ''))
    const bb = parseFloat(b.replace(/^3\./, ''))
    // console.log("gtVersion=", aa, '>', bb)
    return (aa > bb)
}




 





