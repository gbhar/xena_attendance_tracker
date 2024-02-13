"""
This class listens on test status from robot tests and accommodates for False Negatives.
Also updates Kibana logs after the test execution.
"""
from datetime import datetime
import ntpath
import os
import pprint
import requests
from robot.api import logger
import json


KIBANA_URL = "https://logging-bridge.eat.jnj.com/v2/applications/robot-logger/log"
DEFAULT_PROJECT = "Robot Framework"
DEFAULT_RF_VERSION = "1.0"
DEFAULT_JIRA_ID = "ZZZZ"
DEBUG_LOG_TAG = "debug_listener_messages"


class ResultsListener(object):
    """
    Listens on results from robot tests.
    Details on implementation at:
    http://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html
    """
    ROBOT_LISTENER_API_VERSION = 3

    def __init__(self):
        self.kibana_payload = {}
        self.debug_log = False
        self.project_name = DEFAULT_PROJECT
        self.robot_framework_version = DEFAULT_RF_VERSION
        self.jira_project_code = DEFAULT_JIRA_ID
        self.scenarios_dict = {}
        self.steps_dict = {}
        self.stories_dict = {}
        self._setup_scenarios_dict()
        self._setup_steps_dict()
        self._setup_stories_dict()

    def _setup_scenarios_dict(self):
        """
        Sets up scenario dict from scratch
        """
        self.scenarios_dict = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "broken": 0,
            "skipped": 0,
            "pending": 0,
            "knownIssue": 0,
        }

    def _setup_steps_dict(self):
        """
        Sets up steps dict from scratch
        """
        self.steps_dict = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "broken": 0,
            "skipped": 0,
            "pending": 0,
            "knownIssue": 0,
        }

    def _setup_stories_dict(self):
        """
        Sets up stories dict from scratch
        """
        self.stories_dict = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "broken": 0,
            "skipped": 0,
            "pending": 0,
            "knownIssue": 0,
        }

    def start_suite(self, data, _):
        """
        Sets up self.kibana_dict for execution of test
        """
        if data.tests:
            self.kibana_payload = {}
            self._setup_scenarios_dict()
            self._setup_steps_dict()
            if self.jira_project_code == DEFAULT_JIRA_ID:
                self._get_jira_project_id(data.doc)

    def end_suite(self, data, result):
        """
        Processes data read in self.kibana_dict and uploads it to kibana dashboard
        """
        if data.tests:
            self._add_to_kibana_log_at_testsuite(result)
            self._update_kibana_log()

    def end_test(self, data, result):
        """
        Process the end test checks and updates.
        If the test tag has name negative then flip the result.
        """
        self._flip_result_on_negative_tag(data, result)
        self._add_to_kibana_log_at_testcase(data, result)

    def _add_to_kibana_log_at_testsuite(self, result):
        """
        Adds suite level information to kibana payload
        :param result: Result read at testsuite level
        """
        self._setup_stories_details(result)

        self.kibana_payload = {
            # TODO:: ENABLE Get Start to get GOC from user
            "GOC": "Pharma",
            "project_name": self._get_project_name(),
            "jira_project_code": self.jira_project_code,
            "start_time": self._convert_datetime(result.starttime),
            "end_time": self._convert_datetime(result.endtime),
            "duration": str(result.elapsedtime),
            "framework": "Robot",
            "framework_version": self._get_robot_framework_version(),
            # remote is a hyperion param, adding it here for consistency
            "remote": "OFF",
            "language_version": "3.6",
            "testing_platform": "desktop/chrome",
            "testing_platform_version": "0.75.6",
            "scenarios": self.scenarios_dict,
            "steps": self.steps_dict,
            "stories": self.stories_dict,
            "plugins": [],
        }

    def _add_to_kibana_log_at_testcase(self, data, result):
        """
        Adds testcase level information to kibana log update
        """
        if self.jira_project_code == DEFAULT_JIRA_ID:
            self._get_jira_project_id(data.doc)
            self.kibana_payload["jira_project_code"] = self.jira_project_code
        self._setup_scenario_details(result)
        self._setup_step_details(data, result)
        if DEBUG_LOG_TAG in data.tags:
            self.debug_log = True

    def _setup_stories_details(self, result):
        """
        Adds result based information to self.suites_dict
        :param result: Result read from the end_test function
        """
        self.stories_dict["total"] += 1
        if str(result.passed) == "True":
            self.stories_dict["passed"] += 1
        elif str(result.passed) == "False":
            self.stories_dict["failed"] += 1
        if str(result.status) == "SKIP":
            self.stories_dict["skipped"] += 1

    def _setup_scenario_details(self, result):
        """
        Adds result based information to self.scenarios_dict
        :param result: Result read from the end_test function
        """
        self.scenarios_dict["total"] += 1
        if result.status == "PASS":
            self.scenarios_dict["passed"] += 1
        elif result.status == "FAIL":
            self.scenarios_dict["failed"] += 1
        if not result.critical:
            self.scenarios_dict["skipped"] += 1

    def _setup_step_details(self, data, result):
        """
        Adds result based information to self.steps_dict
        :param result: Result read from the end_test function
        """
        total_keywords = len(data.keywords)
        self.steps_dict["total"] += total_keywords
        self.steps_dict["passed"] += total_keywords
        if result.status == "FAIL":
            self.steps_dict["failed"] += 1
            self.steps_dict["passed"] -= 1
        if not result.critical:
            self.steps_dict["skipped"] += total_keywords
            self.steps_dict["passed"] -= total_keywords

    @staticmethod
    def _convert_datetime(time_format):
        """
        Converts time format string to Zulu format expected by Kibana
        :param time_format: Datetime read form Robot Test execution, e.g. 20200813 23:42:54.538
        :returns datetime in format: 2020-07-02T12:01:02.865Z
        """
        date_object = datetime.strptime(time_format, "%Y%m%d %H:%M:%S.%f")
        return date_object.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"

    @staticmethod
    def _flip_result_on_negative_tag(data, result):
        """
        Flips the result on negative tag
        """
        if "negative" in data.tags:
            if result.status == 'FAIL':
                result.status = 'PASS'
                result.message = 'Test was expected to fail and it did fail.'
            elif result.status == "PASS":
                result.status = 'FAIL'
                result.message = 'Test was expected to fail but it actually passed.'

    @staticmethod
    def _get_readme_first_line():
        """
        Fetches first line from the project Readme file.
        """
        file_data = ""
        test_directory = ntpath.dirname(
            os.path.dirname(os.path.realpath(__file__)))
        try:
            tests_readme_file = os.sep.join([test_directory, "Readme.md"])
            file_data = open(tests_readme_file, "r").readlines()[0]
        except FileNotFoundError:
            logger.info("Filepath %s not found" % tests_readme_file)
        return file_data

    def _get_project_name(self):
        """
        Fetches project name from the readme file in the project.
        """
        if self.project_name == DEFAULT_PROJECT:
            file_data = self._get_readme_first_line()
            try:
                self.project_name = file_data.strip().split("Project: ", 1)[1].\
                    split(" Robot Framework Version", 1)[0].strip()
            except IndexError:
                pass
        return self.project_name

    def _get_robot_framework_version(self):
        """
        Fetches robot framework version number
        :return: Version number used with Robot Framework
        """
        if self.robot_framework_version == DEFAULT_RF_VERSION:
            file_data = self._get_readme_first_line()
            try:
                self.robot_framework_version = file_data.rsplit(
                    "Robot Framework Version: ", 1)[1].strip()
            except IndexError:
                pass
        return self.robot_framework_version

    def _get_jira_project_id(self, documentation):
        """
        Fetches jira project id based on documentation of suite or test.
        Once set that code is used for remainder of the tests.
        :param documentation: Documentation from suite or test
        :return: Jira project id code string
        """
        jira_code_string = "jira-id:"
        if self.jira_project_code == DEFAULT_JIRA_ID and jira_code_string in documentation.lower():
            search_string = documentation.lower().split(jira_code_string, 1)[1]
            if "-" in search_string:
                self.jira_project_code = search_string.split(
                    "-", 1)[0].strip().upper()
        return self.jira_project_code

    def _update_kibana_log(self):
        """
        Executes a post request to kibana logs to update the latest data.
        """
        if self.kibana_payload:
            try:
                # username and password are converted to a basic auth token
                headers = {
                    'Authorization': 'Basic cm9ib3Q6cHJvZExvZ2dpbmdAMVJvYm90',
                    'Content-Type': 'application/json'
                    }
                response = requests.post(KIBANA_URL, headers=headers, data= json.dumps(self.kibana_payload))
                if self.debug_log:
                    pp = pprint.PrettyPrinter(indent=4)
                    print(json.dumps(self.kibana_payload))
                    self.debug_log = False
                    print(response.status_code)
                    print(response.content)
            except requests.exceptions.RequestException:
                pass
            self.kibana_payload = {}
