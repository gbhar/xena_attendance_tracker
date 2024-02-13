Scenario: Perform a visual test on the practice site
Given I am on a page with the URL '${xenaTrainingAppURL}'
When I compare the opened page against the visual baseline with name '${xenaTrainingAppURL}' with match level 'STRICT'