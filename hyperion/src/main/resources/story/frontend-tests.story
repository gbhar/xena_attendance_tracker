Scenario: Verify That we can load the training site
Given I am on a page with the URL '${xenaTrainingAppURL}'
Then the page with the URL '${xenaTrainingAppURL}' is loaded
Then the text '<appData>' exists
Examples:
|appData|
|Attendence Trackr|
|NEW LATE REPORT|
|John Doe|
|jane.tudor@example.com|
|Grant|
|Mason|