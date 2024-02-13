# Hyperion Tests for the XENA Training App

Welcome to your Hyperion Test Repository. Please update your the project's placeholder name above.

## Installation

If you haven't installed Hyperion yet, please follow the instructions here, https://sourcecode.jnj.com/projects/ASX-NACI/repos/hyperion_manager/browse

## Default Properties

Open the configuration.properties file, and make sure you paste the property indicated below

```
com.jjconsumer.dte.configuration/environment=local
```

## Some Basic Runner Commands

Open a terminal window and use the following commands.

Run your tests

```
$ ./gradlew runHyperionTests
```

Show Available Test Steps

```
$ ./gradlew showHyperionSteps
```

## Reading Hyperion Reports

After you run your tests, a report will be created. You can find this report in the *output/reports/allure* folder where the base tests repository is found. Due to changes in how browsers handle local javascript files, you will now need to start a webserver on the reports folder in order for you to see the report via a local browser.


```
├── output
│   └── reports
│       ├── allure <- this is where the index.html of the report resides
```

1. Start a Webserver via Python3 (or any webserver of your choice)

```
/your-tests-folder/output/reports/allure
13:42 $ python -m http.server 6789
```

2. Open the reports page by opening your browser to http://localhost:6789

## Questions and Support
[Hyperion MS Teams Support Chat](https://teams.microsoft.com/l/channel/19%3a143a57053dfa4952a1c24f8b799fa226%40thread.skype/Support?groupId=6d07c7ac-1ab6-4d76-a65e-36ee071a6a30&tenantId=3ac94b33-9135-4821-9502-eafda6592a35)
