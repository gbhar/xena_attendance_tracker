#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
  -l|--list)
  ACTION="list"
  DIR="$2"
  shift # past argument
  shift # past value
  ;;
  -e|--encrypt)
  ACTION="encrypt"
  DIR="$2"
  shift # past argument
  shift # past value
  ;;
  -d|--dir)
  ACTION="decrypt"
  DIR="$2"
  shift # past argument
  shift # past value
  ;;
  *)    # unknown option
  echo "Unknown argument $1"
  exit 1
  ;;
esac
done

if [ -z "$ACTION" ]
then
      echo "usage: manage-secrets.sh [-l|--list <dir>] [-e|--encrypt <dir>] [-d|--decrypt <dir>]"
      exit 2
fi

if [ -z "$DIR" ]
then
      echo "usage: manage-secrets.sh [-l|--list <dir>] [-e|--encrypt <dir>] [-d|--decrypt <dir>]"
      exit 3
fi

GPG_HOME=.gpg-home

if [ $ACTION == "list" ]
then
  find $DIR -maxdepth 1 -name "*encrypted*" -print
elif [ $ACTION == "encrypt" ]
then
  rm -rf $GPG_HOME
  mkdir -p $GPG_HOME
  chmod 700 $GPG_HOME
  KEYS=( $(find .keys -maxdepth 1 -mindepth 1 -print) )
  for KEY in "${KEYS[@]}"
  do
    echo "Importing key [$KEY] to [$GPG_HOME]"
    gpg --homedir $GPG_HOME --import $KEY
    echo
  done

  export GNUPGHOME=$GPG_HOME
  FILES=( $(find $DIR -maxdepth 1 -name "*decrypted*" -print) )
  for FILE in "${FILES[@]}"
  do
    ENCRYPTED_FILE=$(echo $FILE | sed s/decrypted/encrypted/g)
    echo "encrypting file [$FILE] to [$ENCRYPTED_FILE]"
    sops -e $FILE > $ENCRYPTED_FILE
    if [ $? -eq 0 ]; then
      echo "encryption of [$ENCRYPTED_FILE] complete, deleting [$FILE]"
      rm $FILE
    else
      echo "encryption of [$ENCRYPTED_FILE] failed"
    fi
  done

  rm -rf $GPG_HOME
elif [ $ACTION == "decrypt" ]
then
  FILES=( $(find $DIR -maxdepth 1 -name "*encrypted*" -print) )
  for FILE in "${FILES[@]}"
  do
    DECRYPTED_FILE=$(echo $FILE | sed s/encrypted/decrypted/g)
    echo "decrypting file [$FILE] to [$DECRYPTED_FILE]"
    sops -d $FILE > $DECRYPTED_FILE
    if [ $? -eq 0 ]; then
      echo "decryption of file [$FILE] to [$DECRYPTED_FILE] complete"
    else
      echo "decryption of file [$FILE] failed"
      rm $DECRYPTED_FILE
    fi
  done
else
  echo "unknown action [$ACTION]"
  exit 4
fi

