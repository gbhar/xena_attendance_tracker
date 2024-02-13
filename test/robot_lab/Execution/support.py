"""
This file adds support for driver functionality.
"""
import ntpath
import os
import shutil
import urllib
import bs4
import logger_handler


class Support(object):
    """
    Provides support functionality for driver script
    """
    def __init__(self):
        """
        Initializes Support class
        """
        self.logger = logger_handler.setup('Robot.Support')
        self.temporary_folder = ""

    def clean_output_directory(self, output_dir, cleanoutputdir=False):
        """
        Deletes output directory and then creates it again before the test starts
        for creating clean logs.
        :param output_dir: Robot results directory
        :param cleanoutputdir: Boolean check to delete output directory
        """
        if not output_dir:
            current_directory = os.path.dirname(os.path.realpath(__file__))
            parent_directory = os.path.abspath(os.path.join(current_directory, os.pardir))
            output_dir = os.sep.join([parent_directory, "Output"])

        if not os.path.isdir(output_dir):
            self.logger.info("Cleaning Output Directory: %s", output_dir)
            try:
                os.mkdir(output_dir)
            except OSError:
                pass
        elif cleanoutputdir:
            self.logger.info("Cleaning Output Directory: %s", output_dir)
            try:
                shutil.rmtree(output_dir)
            except FileExistsError:
                shutil.rmtree(output_dir)
            if not os.path.isdir(output_dir):
                os.mkdir(output_dir)

    def delete_filepath(self, file_path):
        """
        Deletes a file specified by local file path.

        :param file_path: File Path on local filesystem to delete
        :type file_path: string
        """
        try:
            if file_path.startswith('"') and file_path.endswith('"'):
                file_path = file_path[1:-1]
            self.logger.info("Deleting filepath: %s", file_path)
            os.remove(file_path)
        except OSError:
            self.logger.info("File not found to delete: %s", file_path)

    def set_environment_variable(self, variable, value=""):
        """
        Sets environment variable to a given value. If no value is
        passed then sets it to blank
        :param variable: Variable to set as environment variable.
        :param value: Value of the variable to be set.
        """
        self.logger.info("Setting Environment variable: ")
        self.logger.info("%s = %s", variable, value)
        os.environ[variable] = value

    @staticmethod
    def get_environment_variable(variable):
        """
        Reads and fetches an environment variable if it is present.
        :param variable: Environment variable to read from system
        :return: Value of the Environment variable read from system
        """
        value = ""
        if variable in os.environ:
            value = os.environ[variable]
        return value

    def update_evidence_paths(self, output_xml_file, pabot_search_directory):
        """
        Searches for evidences listed in output xml file and replaces such path
        with value listed in pabot_search_directory. Ensure that the evidence filepath
        are unique.
        :param output_xml_file: File path for the Output xml file which should be updated
        :param pabot_search_directory: Pabot results output folder to be searched for
            equivalent evidences
        """
        if not os.path.exists(output_xml_file) or not \
                os.path.exists(pabot_search_directory):
            self.logger.info("Pabot output files not found.")
        else:
            self._update_all_messages_in_soup(output_xml_file, pabot_search_directory)

    def _update_all_messages_in_soup(self, output_xml_file, pabot_directory):
        """
        Reads soup and updates messages to point to relative path under pabot output folder.
        Updates xml file with the updated soup with replaced relative evidence path values.
        :param output_xml_file: XML file created through pabot
        :param pabot_directory: Relative path under which to search for existence of evidence
        """
        bs_soup = bs4.BeautifulSoup(open(
            output_xml_file, "r", errors="ignore"), "xml")
        img_src = "img src="
        img_href = "a href="
        messages = [x for x in bs_soup.find_all("msg") if img_src in x.text]
        pabot_directory_files = os.walk(pabot_directory)
        for msg in messages:
            text = msg.text
            update_text = ""
            if img_href in text:
                update_text = img_href
            elif img_src in text:
                update_text = img_src
            if update_text:
                text = self._get_updated_text_from_xml_text(
                    text, update_text, pabot_directory_files)
                msg.string.replace_with(text)
        with open(output_xml_file, "w") as file_object:
            file_object.write(bs_soup.prettify())

    def _get_updated_text_from_xml_text(self, text, xml_text, pabot_directory_files):
        """
        XML text to read data from
        :param text: Text of xml data to parse for file path
        :param xml_text: Starting string to find the relative file path
        :param pabot_directory_files: os.walk format of pabot result directory
        :return: text of messages with updated relative file path
        """
        start_index = text.index(xml_text) + len(xml_text) + 1
        end_index = start_index + text[start_index:].index('"')
        path = text[start_index: end_index]
        updated_path = self._update_path_value(path, pabot_directory_files)
        text = text[:start_index] + updated_path + text[end_index:]
        return text

    @staticmethod
    def _update_path_value(current_path, pabot_directory_files):
        """
        Adds output folder path to current path folder
        :param current_path: Current relative path
        :param pabot_directory_files: os.walk format of pabot result directory
        :return: Path to be added with new relative path formation
        """
        updated_path = current_path
        current_path = urllib.parse.unquote(current_path)
        current_file = ntpath.basename(current_path)
        for root, _, files in pabot_directory_files:
            if current_file in files:
                current_file_path = os.path.join(root, current_file)
                if current_file_path.endswith(current_path):
                    updated_path = current_file_path
                    break
        return urllib.parse.quote(updated_path)
