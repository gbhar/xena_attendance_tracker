# Setting Up Automated Tests

**Created using Robot Framework Version: 1.0.1.**

Please use the following steps to set up the automated tests.

## Pre-requisites

1. Install Python v3.x
2. Install Git

## Create Virtual environment

Navigate to the project directory using the command prompt or terminal.

### On Windows

```
python -m pip install --upgrade pip
pip install virtualenv
mkdir Virtualenv
cd Virtualenv
virtualenv xena
xena\Scripts\activate.bat
cd ..
pip install -r dependencies\requirements.txt
Virtualenv\xena\Scripts\deactivate.bat
```

### On Linux/Mac

```
python3 -m pip install --upgrade pip
pip install virtualenv
mkdir Virtualenv
cd Virtualenv
virtualenv xena
xena/bin/activate
cd ..
pip install -r dependencies/requirements.txt
Virtualenv/xena/bin/deactivate
```

## Execute tests

Navigate to the project directory using the command prompt or terminal.

```
python Execution/driver.py --dryrun
```
