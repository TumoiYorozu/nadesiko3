@echo OFF
ECHO ------------------------------------
ECHO �Ȃł���3 Windows�����C���X�g�[���[
ECHO ------------------------------------

node -v
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
)

ECHO Node.js�����p�ł��܂�
ECHO ----------------------------------
ECHO �Ȃł���3�̎��s�ɕK�v�Ȋ����_�E�����[�h���܂��B
ECHO ���X���҂����������B

CALL npm -g install nadesiko3

ECHO ok.
PAUSE











